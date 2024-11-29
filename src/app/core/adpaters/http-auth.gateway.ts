import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { FirebaseAuthentication } from '@capacitor-firebase/authentication';
import {
  CreateUser,
  createUserSchema,
  LoginUserData,
  loginUserSchema,
  User,
} from '@core/models/user.model';
import { AuthGateway } from '@core/ports/auth.gateway';
import { AuthStateModel } from '@core/stores/auth/auth.state';
import { environment } from '@environments/environment';
import { AuthService } from '@shared/services/auth/auth.service';
import { FirebaseAuthenticationService } from '@shared/services/firebase-authentication/firebase-authentication.service';
import { addMinutes } from 'date-fns';
import { pick } from 'radash';
import {
  catchError,
  exhaustMap,
  from,
  map,
  Observable,
  switchMap,
  tap,
  throwError,
} from 'rxjs';

export class HttpAuthGateway implements AuthGateway {
  private readonly http = inject(HttpClient);
  private readonly firebaseAuthenticationService = inject(
    FirebaseAuthenticationService
  );
  private readonly authService = inject(AuthService);

  login(data: LoginUserData): Observable<AuthStateModel> {
    const safeParse = loginUserSchema.safeParse(data);
    if (!safeParse.success && safeParse.error) {
      console.error(safeParse.error);
      return throwError(
        () =>
          new Error(`Invalid login data ${safeParse.error.errors[0].message}`)
      );
    }
    console.log('');

    return from(
      this.firebaseAuthenticationService.signInWithEmailAndPassword({
        ...data,
      })
    ).pipe(
      switchMap(async () => {
        const tokenResult = await FirebaseAuthentication.getIdToken();
        console.log(
          '🚀 ~ HttpAuthGateway ~ switchMap ~ tokenResult:',
          tokenResult
        );

        return {
          idToken: tokenResult.token,
          exp: addMinutes(new Date(), 58).getTime(),
        };
      }),
      switchMap((credentials) =>
        this.verifyToken(pick(credentials, ['idToken'])).pipe(
          map((user) => ({
            user,
            credentials,
          }))
        )
      ),
      catchError((err) => {
        console.error('Login error:', err);
        throw err;
      })
    );
  }

  register(data: CreateUser): Observable<AuthStateModel> {
    const safeParse = createUserSchema.safeParse(data);
    if (!safeParse.success && safeParse.error) {
      console.error(safeParse.error);
      throw new Error(
        `Invalid login data ${safeParse.error.errors[0].message}`
      );
    }

    const formData = new FormData();

    formData.append('email', data.email);
    formData.append('password', data.password);
    formData.append('full_name', data.full_name);
    formData.append('username', data.username);
    if (data.idToken) {
      formData.append('idToken', data.idToken);
      formData.append('is_provider', data.is_provider.toString());
    }

    data.interests.forEach((interest) => {
      formData.append('interests', interest);
    });

    if (data.avatar) {
      formData.append('avatar', data.avatar);
    }
    if (data.gender) {
      formData.append('gender', data.gender);
    }
    if (data.birthday) {
      const birthdayValue = new Date(data.birthday).toISOString();
      formData.append('birthday', birthdayValue);
    }
    if (data.bio) {
      formData.append('bio', data.bio);
    }

    return this.http
      .post<User>(`${environment.serverUrl}/api/auth/signup`, formData, {
        headers: {
          Accept: 'application/json',
        },
      })
      .pipe(
        exhaustMap(async (user) => {
          if (!data.is_provider) {
            await this.firebaseAuthenticationService.signInWithEmailAndPassword(
              {
                email: data.email,
                password: data.password,
              }
            );
          }

          return user;
        }),
        switchMap(async (res) => {
          const tokenResult = await FirebaseAuthentication.getIdToken();

          return {
            credentials: {
              idToken: tokenResult.token,
              exp: addMinutes(new Date(), 58).getTime(),
            },
            user: res,
          };
        })
      );
  }

  verifyToken(data: { idToken: string }): Observable<User> {
    return this.http.post<User>(
      `${environment.serverUrl}/api/auth/verify-token`,
      { ...data },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }

  refreshToken(): Observable<AuthStateModel> {
    return from(
      this.firebaseAuthenticationService.getIdToken({ forceRefresh: true })
    ).pipe(
      map((token) => {
        return {
          idToken: token,
          exp: addMinutes(new Date(), 58).getTime(),
        };
      }),
      exhaustMap((token) =>
        this.verifyToken(token).pipe(
          map((user) => {
            return {
              credentials: token,
              user: user,
            };
          })
        )
      )
    );
  }

  googleProviderAuth(): Observable<AuthStateModel | null> {
    return from(this.firebaseAuthenticationService.signInWithGoogle()).pipe(
      tap(async (result) => {
        const token = await this.firebaseAuthenticationService.getIdToken();
        const currentUser = result.user;

        this.authService.googleUser = {
          email:
            currentUser.email ||
            currentUser.providerData[0].email ||
            currentUser.providerData[1].email,
          displayName: currentUser.displayName,
          imageUrl: currentUser.photoUrl,
          authentication: {
            idToken: token,
          },
        };
      }),
      switchMap(() => from(this.firebaseAuthenticationService.getIdToken())),
      switchMap((token) =>
        this.http
          .post<User | null>(
            `${environment.serverUrl}/api/auth/provider-login`,
            { idToken: token },
            {
              headers: { 'Content-Type': 'application/json' },
            }
          )
          .pipe(
            map((user) => {
              if (user) {
                return {
                  user,
                  credentials: {
                    idToken: token,
                    exp: addMinutes(new Date(), 58).getTime(),
                  },
                };
              }

              return null;
            })
          )
      )
    );
  }

  logout(firebaseId: string): Observable<any> {
    return this.http.post<any>(
      `${environment.serverUrl}/api/auth/logout`,
      {},
      {
        params: {
          firebase_uid: firebaseId,
        },
      }
    );
  }
}
