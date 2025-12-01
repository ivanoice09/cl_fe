import { inject } from '@angular/core';
import {
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { AlertService } from '../../shared/services/alert-service';
import { Auth } from '../../shared/services/auth';

interface JwtPayload {
  exp?: number;
}

export const jwtInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn,
): Observable<HttpEvent<any>> => {
  const router = inject(Router);
  const alertService = inject(AlertService);
  const auth = inject(Auth);

  const token = localStorage.getItem('jwtToken') || sessionStorage.getItem('jwtToken');

  if (token) {
    let isExpired = false;

    try {
      const payload = jwtDecode<JwtPayload>(token);
      if (payload?.exp && payload.exp * 1000 <= Date.now()) {
        isExpired = true;
      }
    } catch (error) {
      isExpired = true;
    }

    if (isExpired) {
      auth.SetJwtInfo(false);
      alertService.showPersistent(
        'Your session has expired. Please sign in again to continue.',
        'warning',
      );
      router.navigate(['/login']);
      return next(req);
    }

    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });

  }

  return next(req);

};
