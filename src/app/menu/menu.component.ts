import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../shared/components/header/header.component';
import { LoadingService } from '../shared/services/loading.service';
import { Observable, finalize } from 'rxjs';
import { User } from '../shared/models/users.model';
import { AuthEntityService } from '../auth/store/auth-entity.service';
import { UserEntityService } from '../store/user/user-entity.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    HeaderComponent
  ]
})
export class MenuComponent {
  private readonly userEntityService = inject(UserEntityService);
  private readonly authEntityService = inject(AuthEntityService);
  private readonly router = inject(Router);
  private readonly loadingService = inject(LoadingService);

  currentUser$: Observable<User> = this.userEntityService.currentUser$;

  logout(): void {
    const logout$ = this.authEntityService.logout()
      .pipe(finalize(() => {
        this.router.navigate(['/login']);
      }))
      

    this.loadingService.showLoaderUntilCompleted(logout$).subscribe({
      error: (error) => {
        console.error('Erro ao fazer logout:', error);
        this.authEntityService.clearAuthData();
        this.router.navigate(['/login']);
      }
    });
  }
}
