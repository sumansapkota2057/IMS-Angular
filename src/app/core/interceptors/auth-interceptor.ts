import { HttpInterceptorFn } from '@angular/common/http';
import { Auth } from '../services/auth';
import { inject } from '@angular/core';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(Auth);
  const credentials = authService.getCredentials();

  if (credentials && !req.url.includes('/auth/register') && !req.url.includes('/auth/login')) {
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Basic ${credentials}`
      }
    });
    return next(clonedRequest);
  }

  return next(req);
};
