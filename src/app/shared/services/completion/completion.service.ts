import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CreateUser, Interest } from '@core/models/user.model';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const httpOptions2 = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class CompletionService {
  private readonly http = inject(HttpClient);

  profile: CreateUser;

  complete(data): Observable<any> {
    return this.http.patch(environment.apiUrl + 'user/profile', data);
  }
  updateProfile(data): Observable<any> {
    return this.http.patch(environment.apiUrl + 'user/profile', data);
  }
  getInterests(): Observable<Interest[]> {
    return this.http.get<Interest[]>(
      environment.serverUrl + '/api/interest/list',
      httpOptions2
    );
  }

  interset(data): Observable<any> {
    return this.http.post(
      environment.apiUrl + 'user/interests',
      data,
      httpOptions2
    );
  }
}
