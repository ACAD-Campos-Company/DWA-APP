import { Routes } from '@angular/router';
import { authGuard } from './shared/utils/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
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
    canActivate: [authGuard],
  },
  {
    path: 'first-access',
    loadComponent: () =>
      import('./auth/first-access/first-access.component').then((m) => m.FirstLoginComponent),
    canActivate: [authGuard]
  },
  {
    path: 'first-access/:id',
    loadComponent: () =>
      import('./auth/first-access/first-access.component').then((m) => m.FirstLoginComponent),
    canActivate: [authGuard],
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
    path: '**',
    redirectTo: 'login',
  },
];
