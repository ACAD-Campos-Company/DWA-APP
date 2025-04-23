import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../components/header/header.component';
import { PushNotificationService } from '../../services/push-notification.service';
import { NotificationCardComponent } from './notification-card/notification-card.component';
import { Notification } from '../../models/notification.model';
import { Observable, map, BehaviorSubject } from 'rxjs';
import { NotificationHandlerService } from '../../services/notification-handler.service';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, HeaderComponent, NotificationCardComponent],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.scss'
})
export class NotificationsComponent {
  unreadNotifications$: Observable<Notification[]>;
  readNotifications$: Observable<Notification[]>;
  isMarkingAll = new BehaviorSubject<boolean>(false);
  isMarkingAll$ = this.isMarkingAll.asObservable();
  activeTab: 'read' | 'unread' = 'unread';

  constructor(
    private pushNotificationService: PushNotificationService,
    private notificationHandler: NotificationHandlerService
  ) {
    this.unreadNotifications$ = this.pushNotificationService.notifications$.pipe(
      map(notifications => notifications.filter(n => !n.read).sort((a, b) => b.timestamp - a.timestamp))
    );
    
    this.readNotifications$ = this.pushNotificationService.notifications$.pipe(
      map(notifications => notifications.filter(n => n.read).sort((a, b) => b.timestamp - a.timestamp))
    );
  }

  handleNotificationClick(notification: Notification) {
    if (!notification.read) {
      this.pushNotificationService.markAsRead(notification.id).subscribe(() => {
        this.handleNotificationType(notification);
      });
    } else {
      this.handleNotificationType(notification);
    }
  }

  markAsRead(id: string) {
    this.pushNotificationService.markAsRead(id).subscribe();
  }

  markAllAsRead() {
    this.isMarkingAll.next(true);
    this.pushNotificationService.markAllAsRead().subscribe({
      next: () => {
        this.isMarkingAll.next(false);
      },
      error: () => {
        this.isMarkingAll.next(false);
      }
    });
  }

  private handleNotificationType(notification: Notification) {
    if (notification.type.toLowerCase() === 'training' || notification.type.toLowerCase() === 'general') {
      return;
    }
    
    this.notificationHandler.handleNotification({
      type: notification.type,
      title: notification.title,
      body: notification.body,
      image: notification.image
    });
  }

  setActiveTab(tab: 'read' | 'unread') {
    this.activeTab = tab;
  }
}
