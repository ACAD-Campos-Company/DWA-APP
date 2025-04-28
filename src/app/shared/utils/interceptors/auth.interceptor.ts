import { HttpInterceptorFn } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { AuthEntityService } from '../../../auth/store/auth-entity.service';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authEntityService = inject(AuthEntityService);
  let token: string | null = null;
  token = authEntityService.getToken();

  if (token) {
    const cloned = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });

    return next(cloned).pipe(
      catchError(error => {
        if (error.status === 401 && error.error.message === 'Usuário não autenticado.') {
          authEntityService.logout().subscribe({
            error: () => {
              authEntityService.clearAuthData();
              router.navigate(['/login']);
            },
            complete: () => {
              router.navigate(['/login']);
            }
          });
        }
        return throwError(() => error);
      })
    );
  }

  return next(req);
};
