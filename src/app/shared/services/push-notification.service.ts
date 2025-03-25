import { inject, Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';
import { BehaviorSubject, Observable, shareReplay, interval, Subscription, startWith, takeUntil, Subject, tap } from 'rxjs';
import { App } from '@capacitor/app';
import { Notification } from '../models/notification.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { UserEntityService } from '../../store/user/user-entity.service';
import { User } from '../models/users.model';
import { NotificationHandlerService } from './notification-handler.service';

@Injectable({
  providedIn: 'root'
})
export class PushNotificationService {
  private http = inject(HttpClient);
  private readonly userEntityService = inject(UserEntityService);
  private readonly notificationHandler = inject(NotificationHandlerService);

  private currentUser!: User;
  private notifications = new BehaviorSubject<Notification[]>([]);
  private unreadCount = new BehaviorSubject<number>(0);
  private apiUrl = environment.api;
  private refreshInterval = 30000;
  private pollingSubscription!: Subscription;
  private destroy$ = new Subject<void>();

  notifications$ = this.notifications.asObservable();
  unreadCount$ = this.unreadCount.asObservable();

  async initPush() {
    this.userEntityService.currentUser$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(user => {
      this.currentUser = user;
      user.id ? this.startPolling() : this.stopPolling();
    });

    if (Capacitor.getPlatform() === 'android') {
      await this.setupAndroidPushNotifications();
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.stopPolling();
  }

  private startPolling() {
    this.stopPolling();
    this.updateUserNotifications();
    
    this.pollingSubscription = interval(this.refreshInterval)
      .pipe(startWith(0), takeUntil(this.destroy$))
      .subscribe(() => this.updateUserNotifications());
  }

  private stopPolling() {
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
    }
  }

  private async setupAndroidPushNotifications() {
    try {
      const permStatus = await PushNotifications.checkPermissions();
      if (permStatus.receive === 'prompt' || permStatus.receive === 'prompt-with-rationale') {
        const perm = await PushNotifications.requestPermissions();
        if (perm.receive !== 'granted') return;
      }

      await PushNotifications.register();
      this.setupNotificationListeners();
    } catch (e) {
      console.error('Erro ao inicializar push notifications:', e);
    }
  }

  private setupNotificationListeners() {
    App.addListener('appStateChange', ({ isActive }) => {
      if (isActive && this.currentUser?.id) {
        this.updateUserNotifications();
      }
    });

    PushNotifications.addListener('registration', (token) => {
      this.registerDeviceToken(token.value);
    });

    PushNotifications.addListener('pushNotificationReceived', (notification) => {
      this.handleIncomingNotification(notification);
    });

    PushNotifications.addListener('pushNotificationActionPerformed', (action) => {
      this.handleIncomingNotification(action.notification);
    });
  }

  private handleIncomingNotification(notification: any) {
    const newNotification: Notification = {
      id: notification.id || Date.now().toString(),
      title: notification.data?.title || notification.title || 'Nova notificação',
      body: notification.data?.body || notification.body || 'Você recebeu uma nova notificação',
      read: false,
      timestamp: Date.now(),
      type: notification.data?.type || 'general',
      image: notification.data?.image
    };

    this.addNotification(newNotification);
  }

  private addNotification(notification: Notification) {
    const currentNotifications = this.notifications.value;
    if (!currentNotifications.some(n => n.id === notification.id)) {
      this.saveNotifications([notification, ...currentNotifications]);
      this.notificationHandler.handleNotification({
        type: notification.type,
        title: notification.title,
        body: notification.body,
        image: notification.image
      });
    }
  }

  private saveNotifications(notifications: Notification[]) {
    this.notifications.next(notifications);
    this.unreadCount.next(notifications.filter(n => !n.read).length);
  }

  markAsRead(id: string) {
    return this.markMultipleAsRead([id]);
  }

  markMultipleAsRead(ids: string[]) {
    const endpoint = `${this.apiUrl}user-notifications/${this.currentUser.id}/mark-as-read`;
    return this.http.post(endpoint, { ids }).pipe(
      tap(() => {
        const updatedNotifications = this.notifications.value.map(n =>
          ids.includes(n.id) ? { ...n, read: true } : n
        );
        this.saveNotifications(updatedNotifications);
      })
    );
  }

  markAllAsRead() {
    const unreadIds = this.notifications.value
      .filter(n => !n.read)
      .map(n => n.id);
    
    return unreadIds.length > 0
      ? this.markMultipleAsRead(unreadIds)
      : this.http.post(`${this.apiUrl}user-notifications/${this.currentUser.id}/mark-as-read`, { ids: [] });
  }

  updateUserNotifications() {
    this.destroy$.next();
    this.getUserNotifications().pipe(
      takeUntil(this.destroy$),
      shareReplay(1)
    ).subscribe((response: any) => {
      if (!response.data) return;

      const notifications = Array.isArray(response.data)
        ? response.data.map(this.mapNotificationFromResponse)
        : [this.mapNotificationFromResponse(response.data)];

      this.saveNotifications(notifications);
    });
  }

  private mapNotificationFromResponse(item: any): Notification {
    return {
      id: item.id.toString(),
      title: item.notification?.title || 'Nova notificação',
      body: item.notification?.message || 'Você recebeu uma nova notificação',
      read: item.read,
      timestamp: new Date(item.created_at).getTime(),
      type: item.notification?.type || 'general',
      image: item.notification?.image
    };
  }

  private getUserNotifications(): Observable<any> {
    return this.http.get(`${this.apiUrl}user-notifications/${this.currentUser.id}`);
  }

  private registerDeviceToken(token: string) {
    this.userEntityService.sendTokenStorage(token, Capacitor.getPlatform()).subscribe({
      next: () => console.log('Token registrado com sucesso'),
      error: (error) => console.error('Erro ao registrar token:', JSON.stringify(error))
    });
  }
}