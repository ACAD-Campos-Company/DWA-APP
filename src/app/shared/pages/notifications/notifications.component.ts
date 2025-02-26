import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../components/header/header.component';
import { PushNotificationService } from '../../services/push-notification.service';
import { NotificationCardComponent } from './notification-card/notification-card.component';
import { Notification } from '../../models/notification.model';
import { Observable, map, tap } from 'rxjs';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, HeaderComponent, NotificationCardComponent],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.scss'
})
export class NotificationsComponent implements OnInit {
  unreadNotifications$: Observable<Notification[]>;
  readNotifications$: Observable<Notification[]>;

  constructor(private pushNotificationService: PushNotificationService) {
    this.unreadNotifications$ = this.pushNotificationService.notifications$.pipe(
      map(notifications => notifications.filter(n => !n.read))
    );
    
    this.readNotifications$ = this.pushNotificationService.notifications$.pipe(
      map(notifications => notifications.filter(n => n.read))
    );
  }

  ngOnInit() {}

  markAsRead(id: string) {
    this.pushNotificationService.markAsRead(id);
  }
}
