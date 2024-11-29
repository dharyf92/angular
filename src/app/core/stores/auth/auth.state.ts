import { inject, Injectable } from '@angular/core';
import { User } from '@core/models/user.model';
import { AuthGateway } from '@core/ports/auth.gateway';
import { Action, State, StateContext } from '@ngxs/store';
import { catchError, of, tap } from 'rxjs';
import { AuthActions } from './auth.actions';

export type Credentials = {
  idToken: string;
  exp: number;
};

export interface AuthStateModel {
  user: User;
  credentials: Credentials;
}

@State<AuthStateModel>({
  name: 'auth',
  defaults: {
    user: null,
    credentials: null,
  },
})
@Injectable()
export class AuthState {
  private readonly authGateway = inject(AuthGateway);

  @Action(AuthActions.Login)
  login(ctx: StateContext<AuthStateModel>, action: AuthActions.Login) {
    return this.authGateway.login(action.payload).pipe(
      tap((session) => {
        ctx.patchState({
          ...session,
        });
      }),
      catchError((err) => {
        console.error('Login error:', err);
        throw err;
      })
    );
  }

  @Action(AuthActions.Register)
  register(ctx: StateContext<AuthStateModel>, action: AuthActions.Register) {
    return this.authGateway.register(action.payload).pipe(
      catchError((err) => {
        throw err;
      }),

      tap((authSession) =>
        ctx.patchState({
          ...authSession,
        })
      )
    );
  }

  @Action(AuthActions.Refresh)
  refresh(ctx: StateContext<AuthStateModel>) {
    return this.authGateway.refreshToken().pipe(
      tap((session) => {
        ctx.patchState({
          ...session,
        });
      })
    );
  }

  @Action(AuthActions.Logout)
  logout(ctx: StateContext<AuthStateModel>) {
    const user = ctx.getState().user;
    console.log('logout', user);

    if (user) {
      return this.authGateway.logout(user.firebase_uid).pipe(
        tap(() => {
          ctx.setState({ user: null, credentials: null });
        })
      );
    }
    return of(null);
  }

  @Action(AuthActions.VerifyToken)
  verifyToken(
    ctx: StateContext<AuthStateModel>,
    action: AuthActions.VerifyToken
  ) {
    return this.authGateway.verifyToken(action.payload).pipe(
      tap((authSession) =>
        ctx.patchState({
          ...ctx.getState(),
          user: authSession,
        })
      )
    );
  }

  @Action(AuthActions.SaveUser)
  saveUser(ctx: StateContext<AuthStateModel>, action: AuthActions.SaveUser) {
    ctx.patchState({
      ...ctx.getState(),
      user: action.payload,
    });
  }

  @Action(AuthActions.GoogleLogin)
  googleLogin(ctx: StateContext<AuthStateModel>) {
    return this.authGateway.googleProviderAuth().pipe(
      tap((authSession) => {
        if (authSession) {
          ctx.patchState({
            ...authSession,
          });
        } else {
          ctx.setState({
            user: null,
            credentials: null,
          });
        }
      })
    );
  }
}
