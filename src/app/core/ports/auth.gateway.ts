import { CreateUser, LoginUserData, User } from '@core/models/user.model';
import { AuthStateModel, Credentials } from '@core/stores/auth/auth.state';
import { Observable } from 'rxjs';

export abstract class AuthGateway {
  abstract login(data: LoginUserData): Observable<AuthStateModel>;
  abstract register(data: CreateUser): Observable<AuthStateModel>;
  abstract verifyToken(data: { idToken: string }): Observable<User>;
  abstract refreshToken(): Observable<AuthStateModel>;

  abstract googleProviderAuth(): Observable<AuthStateModel | null>;

  abstract logout(firebaseId: string): Observable<any>;
}
