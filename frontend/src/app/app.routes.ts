import { Routes } from '@angular/router';
import { tokenGuard } from './shared/utils/guards/token.guard';
import { authGuard } from './shared/utils/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login'
  },
  {
    path: '**',
    redirectTo: 'login',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./auth/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'on-boarding',
    loadComponent: () =>
      import('./auth/onboarding/onboarding.component').then((m) => m.OnboardingComponent),
  },
  {
    path: 'first-access',
    loadComponent: () =>
      import('./auth/first-access/first-access.component').then((m) => m.FirstLoginComponent),
  },
  {
    path: 'reset-password',
    loadComponent: () =>
      import('./auth/reset-password/reset-password.component').then((m) => m.ResetPasswordComponent),
  },
  {
    path: 'reset-password/:id/:token',
    loadComponent: () =>
      import('./auth/reset-password/reset-password.component').then((m) => m.ResetPasswordComponent),
  },
  {
    path: 'first-access/:id',
    loadComponent: () =>
      import('./auth/first-access/first-access.component').then((m) => m.FirstLoginComponent),
    canActivate: [authGuard]
  }
];
