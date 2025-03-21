import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthEntityService } from '../../../auth/store/auth-entity.service';

export const authGuard = async () => {
  const authEntityService = inject(AuthEntityService);
  const router = inject(Router);

  let token = authEntityService.getToken();
  
  if (!token) {
    token = localStorage.getItem('authToken') || '';
    
    if (token) {
      authEntityService.setTokenFromStorage(token);
    }
  }

  if (token) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};
