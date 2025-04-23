import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
import { tap } from 'rxjs';
import { TrainingEntityService } from '../../store/training/training-entity.service';
import { UserEntityService } from '../../store/user/user-entity.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationHandlerService {
  constructor(
    private trainingEntityService: TrainingEntityService,
    private userEntityService: UserEntityService
  ) { }

  handleNotification(notification: { type: string; title: string; body: string, image?: string }) {
    try {
      switch (notification.type.toLowerCase()) {
        case 'birthday':
          this.handleBirthdayNotification(notification);
          break;
        case 'training':
          this.handleTrainingNotification();
          break;
        default:
          if(notification.image) {
            this.handleImageNotification({ title: notification.title, body: notification.body, image: notification.image });
          }
          break;
      }
    } catch (error) {
      console.error('Error handling notification:', error);
    }
  }

  private handleBirthdayNotification(notification: { title: string; body: string }) {
    Swal.fire({
      title: '🎉 Feliz Aniversário! 🎉',
      html: `
        <div class="text-center">
          <p class="text-white">${notification.body || 'A DWA academia deseja um feliz aniversário!'}</p>
        </div>
      `,
      confirmButtonText: 'Obrigado!',
      confirmButtonColor: '#FF8800',
      background: '#202325',
      color: '#ffffff',
      customClass: {
        popup: 'notification-popup birthday-theme',
        title: 'notification-title',
        confirmButton: 'notification-button'
      }
    });
  }

  private handleTrainingNotification() {
    Swal.fire({
      title: 'Novo Treino!',
      text: 'Você tem um novo treino disponível',
      icon: 'success',
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true
    });
  }

  private handleImageNotification(notification: { title: string; body: string, image: string }) {
    Swal.fire({
      title: notification.title,
      html: `
        <div class="d-flex flex-column">
          <div class="rounded-4 overflow-hidden mb-4">
            <img src="${notification.image}" class="img-fluid w-100" alt="${notification.title}">
          </div>
          <p class="text-white" style="font-style: italic;">${notification.body}</p>
        </div>
      `,
      showConfirmButton: true,
      confirmButtonText: 'OK',
      confirmButtonColor: '#D4A056',
      background: '#202325',
      color: '#ffffff',
      width: '32rem',
      padding: '2rem',
      customClass: {
        popup: 'rounded-4',
        title: 'fs-2 mb-3',
        confirmButton: 'btn btn-lg px-5 rounded-pill'
      }
    });
  }
} 