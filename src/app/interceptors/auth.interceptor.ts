import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthContextService } from '../auth/auth-context.service';
import { Router } from '@angular/router';
import { ToastService } from '../services/toast.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authContext = inject(AuthContextService);
  const router = inject(Router);
  const toastService = inject(ToastService);

  const token = authContext.getToken();
  console.log('Token in interceptor:', token); // Debug log
  
  if (token) {
    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
    console.log('Request headers:', authReq.headers); // Debug log
    return next(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          authContext.clearAuthContext();
          router.navigate(['/login']);
          toastService.showError('Su sesión ha expirado. Por favor, inicie sesión nuevamente.');
        }
        return throwError(() => error);
      })
    );
  }

  return next(req);
}; 