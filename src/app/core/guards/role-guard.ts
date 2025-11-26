import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';

import { Auth } from '../services/auth';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(Auth);
  const router = inject(Router);

  const requiredRole = route.data['role'] as string;

  if (authService.isAuthenticated() && authService.hasRole(requiredRole)) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};