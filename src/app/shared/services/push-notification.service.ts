import { inject, Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';
import { BehaviorSubject, Observable, shareReplay } from 'rxjs';
import { App } from '@capacitor/app';
import { Notification } from '../models/notification.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { UserEntityService } from '../../store/user/user-entity.service';
import { User } from '../models/users.model';

@Injectable({
  providedIn: 'root'
})
export class PushNotificationService {
  private http = inject(HttpClient);
  private readonly userEntityService = inject(UserEntityService);

  private currentUser!: User;
  private notifications = new BehaviorSubject<Notification[]>([]);
  private unreadCount = new BehaviorSubject<number>(0);
  private apiUrl = environment.api;

  notifications$ = this.notifications.asObservable();
  unreadCount$ = this.unreadCount.asObservable();

  async initPush() {
    this.userEntityService.currentUser$.subscribe(user => {
      this.currentUser = user;

      if (user.id) {
        this.updateUserNotifications();
      }
    });

    await this.setPushNotifications();
  }

  private saveNotifications(notifications: Notification[]) {
    console.log('Notificações salvas:', notifications);
    this.notifications.next(notifications);
    this.updateUnreadCount();
  }

  private updateUnreadCount() {
    const unread = this.notifications.value.filter(n => !n.read).length;
    this.unreadCount.next(unread);
    console.log('Contador atualizado:', unread);
  }

  private addNotification(notification: Notification) {
    const currentNotifications = this.notifications.value;
    const exists = currentNotifications.some(n => n.id === notification.id);
    console.log('Notificação adicionada:', notification);
    if (!exists) {
      const updatedNotifications = [notification, ...currentNotifications];
      this.saveNotifications(updatedNotifications);
    }
  }

  private async setPushNotifications() {
    if (Capacitor.getPlatform() === 'android') {
      try {
        const permStatus = await PushNotifications.checkPermissions();

        if (permStatus.receive === 'prompt' || permStatus.receive === 'prompt-with-rationale') {
          const perm = await PushNotifications.requestPermissions();
          if (perm.receive !== 'granted') {
            return;
          }
        }

        await PushNotifications.register();

        App.addListener('appStateChange', ({ isActive }) => {
          if (isActive && this.currentUser?.id) {
            this.updateUserNotifications();
          }
        });

        PushNotifications.addListener('registration', (token) => {
          this.registerDeviceToken(token.value);
        });

        PushNotifications.addListener('pushNotificationReceived', (notification) => {
          console.log('Notificação raw recebida:', JSON.stringify(notification, null, 2));

          const newNotification: Notification = {
            id: notification.id || Date.now().toString(),
            title: notification.data?.title || notification.title || 'Nova notificação',
            body: notification.data?.body || notification.body || 'Você recebeu uma nova notificação',
            read: false,
            timestamp: Date.now()
          };

          this.addNotification(newNotification);
        });

        PushNotifications.addListener('pushNotificationActionPerformed', (action) => {
          console.log('Notificação clicada:', JSON.stringify(action, null, 2));

          const notification = action.notification;
          const newNotification: Notification = {
            id: notification.id || Date.now().toString(),
            title: notification.data?.title || notification.title || 'Nova notificação',
            body: notification.data?.body || notification.body || 'Você recebeu uma nova notificação',
            read: false,
            timestamp: Date.now()
          };

          this.addNotification(newNotification);
        });

      } catch (e) {
        console.error('Erro ao inicializar push notifications:', e);
      }
    }
  }

  getNotifications() {
    return this.notifications$;
  }

  markAsRead(id: string) {
    const currentNotifications = this.notifications.value;
    const updatedNotifications = currentNotifications.map(n =>
      n.id === id ? { ...n, read: true } : n
    );
    this.saveNotifications(updatedNotifications);
  }

  markAllAsRead() {
    const currentNotifications = this.notifications.value;
    const updatedNotifications = currentNotifications.map(n => ({ ...n, read: true }));
    this.saveNotifications(updatedNotifications);
  }

  clearNotifications() {
    this.saveNotifications([]);
  }

  updateUserNotifications() {
    this.getUserNotifications().pipe(
      shareReplay(1)
    ).subscribe((notifications) => {
      console.log('Notificações atualizadas:', notifications);
      this.saveNotifications(notifications);
    });
  }

  getUserNotifications(): Observable<any> {
    const endpoint = `${this.apiUrl}user-notification/${this.currentUser.id}`;
    return this.http.get(endpoint);
  }

  registerDeviceToken(token: string) {
    this.userEntityService.sendTokenStorage(token, Capacitor.getPlatform()).subscribe({
      next: () => {
        console.log('Token registrado com sucesso');
      },
      error: (error) => {
        console.error('Erro ao registrar token:', JSON.stringify(error));
      }
    });
  }

}