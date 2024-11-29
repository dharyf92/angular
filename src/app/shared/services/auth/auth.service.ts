import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserBuilder } from '@core/models/builders/user.builder';
import { GoogleUserData, User } from '@core/models/user.model';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

export type AuthResponse = {
  user: User;
  expiresIn: number;
};

type GoogleLogin = {
  email: string;
  fullName: string;
  photoUrl: string;
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  googleUser: GoogleUserData;
  private readonly ENDPOINT = `${environment.apiUrl}auth/`;
  public email;
  public token;
  constructor(private http: HttpClient) {}

  userBuilder = new UserBuilder();

  login(data: { email: string; password: string }): Observable<any> {
    return this.http.post(
      environment.serverUrl + '/api/auth/signin',
      data,
      httpOptions
    );
  }

  signup(data: FormData): Observable<any> {
    return this.http.post<any>(
      environment.serverUrl + '/api/auth/signup',
      data,
      {
        headers: new HttpHeaders({
          'Content-Type': 'multipart/form-data',
          Accept: 'application/json',
        }),
      }
    );
  }

  passwordRecovery(data): Observable<any> {
    return this.http.post(
      this.ENDPOINT + 'public/password-recovery',
      data,
      httpOptions
    );
  }

  verifyCode(data): Observable<any> {
    return this.http.post(
      this.ENDPOINT + 'public/verify-code',
      data,
      httpOptions
    );
  }

  verifyEmail(email: string): Observable<boolean> {
    return this.http.get<boolean>(
      environment.serverUrl + '/api/auth/verify-email',
      {
        params: new HttpParams().set('email', email),
      }
    );
  }

  googleSignup(token: string) {
    let endpoint = 'googleSignup';

    let body = { token: token };

    return this.http.post<any>(environment.apiUrl + endpoint, body, {
      reportProgress: true,
      observe: 'body',
    });
  }
  googleLogin(data: GoogleLogin) {
    return this.http.post(
      environment.serverUrl + '/api/auth/provider',
      data,
      httpOptions
    );
  }

  getCounties() {
    return this.http.get(' https://restcountries.com/v3.1/all');
  }

  resetPassword(data) {
    return this.http.put(this.ENDPOINT + 'reset-password', data, httpOptions);
  }
}
