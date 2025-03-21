import { Routes } from '@angular/router';
import { authGuard } from './shared/utils/guards/auth.guard';
import { memberGuard } from './shared/utils/guards/member.guard';
import { adminGuard } from './shared/utils/guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login',
  },

  {
    path: 'login',
    loadComponent: () =>
      import('./auth/login/login.component').then((m) => m.LoginComponent)
  },
  {
    path: 'on-boarding',
    loadComponent: () =>
      import('./auth/onboarding/onboarding.component').then((m) => m.OnboardingComponent),
    canActivate: [authGuard],
  },
  {
    path: 'first-access/:id',
    loadComponent: () =>
      import('./auth/first-access/first-access.component').then((m) => m.FirstAccessComponent),
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
    path: 'members',
    loadChildren: () =>
      import('./members/members.routes').then((m) => m.MEMBERS_ROUTES),
    canActivate: [authGuard, memberGuard]
  },
  {
    path: 'personal',
    loadChildren: () =>
      import('./personal/personal.routes').then((m) => m.PERSONAL_ROUTES),
    canActivate: [authGuard, adminGuard]
  },
  {
    path: 'general',
    loadChildren: () =>
      import('./general.routes').then((m) => m.GENERAL_ROUTES),
    canActivate: [authGuard]
  },
  {
    path: 'menu',
    loadChildren: () =>
      import('./menu/menu.routes').then((m) => m.MENU_ROUTES),
    canActivate: [authGuard]
  },
  {
    path: 'notifications',
    loadComponent: () => import('./shared/pages/notifications/notifications.component').then(
      (m) => m.NotificationsComponent
    ),
    canActivate: [authGuard]
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
