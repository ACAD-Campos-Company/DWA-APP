import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthEntityService } from '../../auth/store/auth-entity.service';
import { UserEntityService } from '../../store/user/user-entity.service';
import { PushNotificationService } from './push-notification.service';

@Injectable({
  providedIn: 'root'
})
export class AppInitializerService {
  constructor(
    private router: Router,
    private authEntityService: AuthEntityService,
    private userEntityService: UserEntityService,
    private pushNotificationService: PushNotificationService
  ) {}

  async initializeApp(): Promise<void> {
    const storedToken = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('currentUser');
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    if (storedToken && storedUser && isLoggedIn) {
      try {
        const user = JSON.parse(storedUser);
        this.authEntityService.setTokenFromStorage(storedToken, user);
        
        await this.pushNotificationService.initPush();

        if (this.userEntityService.getIsAdmin()) {
          this.router.navigateByUrl('/personal/home');
        } else {
          this.router.navigateByUrl('/members/home');
        }
      } catch (error) {
        console.error('Error initializing app:', error);
        this.clearAuthData();
        this.router.navigateByUrl('/login');
      }
    } else {
      this.clearAuthData();
      this.router.navigateByUrl('/login');
    }
  }

  private clearAuthData(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isLoggedIn');
    this.authEntityService.clearAuthData();
  }
} 