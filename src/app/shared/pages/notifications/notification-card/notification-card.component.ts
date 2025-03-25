import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Notification } from '../../../models/notification.model';

@Component({
  selector: 'app-notification-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification-card.component.html',
  styleUrls: ['./notification-card.component.scss']
})
export class NotificationCardComponent {
  @Input() notification!: Notification;
  @Input() title!: string;
  @Input() body!: string;
  @Input() read!: boolean;
  @Input() date!: string;
  @Input() imageUrl?: string;
  @Input() type?: string;
  @Input() timestamp?: number;
  @Output() onClose = new EventEmitter<MouseEvent>();
  @Output() click = new EventEmitter<void>();
  @Output() readNotification = new EventEmitter<string>();

  handleClick(event: Event) {
    event.stopPropagation();
    this.click.emit();
  }

  handleClose(event: MouseEvent) {
    this.onClose.emit(event);
  }

  markAsRead(id: string) {
    this.readNotification.emit(id);
  }
}