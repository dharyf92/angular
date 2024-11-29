import {
  HTTP_INTERCEPTORS,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { AuthActions } from '@core/stores/auth/auth.actions';
import { AuthSelectors } from '@core/stores/auth/auth.selectors';
import { Store } from '@ngxs/store';
import { differenceInMinutes, isAfter } from 'date-fns';
import { Observable, switchMap } from 'rxjs';

const TOKEN_HEADER_KEY = 'Authorization';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private readonly store = inject(Store);
  private readonly router = inject(Router);

  private readonly allowedUrls = [
    '194.163.138.25:9000',
    'restcountries',
    'signup',
    'password-recovery',
    'verify-code',
    'verify-email',
    'i18n',
    'verify-token',
    'interest/list',
  ];

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (this.isUrlAllowed(req.url)) {
      console.log(req.url);

      return next.handle(req);
    }

    const credentials = this.store.selectSnapshot(AuthSelectors.getCredentials);

    if (!credentials) {
      console.log('no credentials');
      return next.handle(req);
    }

    if (credentials && this.isTokenExpired(credentials.exp)) {
      return this.store.dispatch(new AuthActions.Refresh()).pipe(
        switchMap(() => {
          const credentials = this.store.selectSnapshot(
            AuthSelectors.getCredentials
          );

          if (!credentials) {
            this.router.navigate(['/sign-in']);
            return next.handle(req);
          }

          const authReq = req.clone({
            headers: req.headers.set(
              TOKEN_HEADER_KEY,
              `Bearer ${credentials.idToken}`
            ),
          });

          return next.handle(authReq);
        })
      );
    }

    const authReq = req.clone({
      headers: req.headers.set(
        TOKEN_HEADER_KEY,
        `Bearer ${credentials.idToken}`
      ),
    });

    return next.handle(authReq);
  }

  private isUrlAllowed(url: string): boolean {
    return this.allowedUrls.some((allowedUrl) => url.includes(allowedUrl));
  }

  private isTokenExpired(expirationDate: number): boolean {
    // Check if time is less than five minutes
    const result = differenceInMinutes(new Date(expirationDate), new Date());

    if (result <= 5) {
      return true;
    }

    // Check if the current time is less than the expiration time
    return isAfter(new Date(), new Date(expirationDate));
  }
}

export const authInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
];
