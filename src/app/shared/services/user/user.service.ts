import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Picker, Profile, User } from '@core/models/user.model';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Filter } from '../posts/posts.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly http = inject(HttpClient);

  getUsers(): Observable<any> {
    return this.http.get(environment.apiUrl + 'users', httpOptions);
  }

  blockUser(id: string) {
    return this.http.post(
      environment.serverUrl + '/api/block-list/' + id,
      {},
      httpOptions
    );
  }

  unblockUser(id: string) {
    return this.http.delete(
      environment.serverUrl + '/api/block-list/' + id,
      httpOptions
    );
  }

  suggestedPickers(
    filter: Filter = { limit: 10, skip: 0 }
  ): Observable<Picker[]> {
    return this.http.get<Picker[]>(
      environment.serverUrl + '/api/user/recommended',
      {
        params: new HttpParams()
          .set('limit', filter.limit)
          .set('offset', filter.skip),
        ...httpOptions,
      }
    );
  }

  getBlockedUsers() {
    return this.http.get(
      environment.serverUrl + '/api/block-list/',
      httpOptions
    );
  }

  pickUser(id: string, status: 'accepted' | 'pending'): Observable<User> {
    const params = new HttpParams().set('invitation_status', status);
    return this.http.post<User>(
      environment.serverUrl + '/api/user/pick/' + id,
      {},
      {
        params,
        ...httpOptions,
      }
    );
  }

  confirmPicker(id: string): Observable<User> {
    const params = new HttpParams().set('invitation_status', 'accepted');
    return this.http.patch<User>(
      environment.serverUrl + '/api/user/pick/' + id,
      {},
      {
        params,
        ...httpOptions,
      }
    );
  }

  getReasons() {
    return this.http.get(environment.apiUrl + 'contact/reasons/', httpOptions);
  }

  contactUs(data) {
    return this.http.post(environment.apiUrl + 'contact/us', data, httpOptions);
  }

  getPickersList(id: string, filter: Filter): Observable<Picker[]> {
    const params = new HttpParams()
      .set('limit', filter.limit)
      .set('offset', filter.skip);
    return this.http.get<Picker[]>(
      environment.serverUrl + '/api/user/pickers/' + id,
      {
        params,
      }
    );
  }

  getMyPickersList(id: string, filter: Filter) {
    let params = new HttpParams()
      .set('limit', filter.limit)
      .set('offset', filter.skip);
    return this.http.get<Picker[]>(
      environment.serverUrl + '/api/user/my-pickers/' + id,
      {
        params,
      }
    );
  }

  listViewers(postId) {
    return this.http.get(
      environment.apiUrl + 'post/views/' + postId,
      httpOptions
    );
  }
  reportUser(userId) {
    let endpoint = 'report';
    let data = {
      report_type: 'Report',
      content_type: 'user',
      content_id: userId,
    };
    return this.http.post(environment.apiUrl + endpoint, data, httpOptions);
    //http://194.163.138.25:5001/api/v1
  }

  trendingPickers(): Observable<Picker[]> {
    return this.http.get<Picker[]>(
      environment.serverUrl + '/api/user/trending/',
      httpOptions
    );
  }

  getProfile(id: string, data = { skip: 0, limit: 20 }): Observable<Profile> {
    const { skip, limit } = data;
    const params = new HttpParams().set('offset', skip).set('limit', limit);
    return this.http.get<Profile>(
      environment.serverUrl + '/api/user/profile/' + id,
      {
        params,
      }
    );
  }

  search(query: string, data = { skip: 0, limit: 20 }): Observable<Picker[]> {
    const { skip, limit } = data;
    const params = new HttpParams().set('offset', skip).set('limit', limit);
    return this.http.get<Picker[]>(
      environment.serverUrl + '/api/user/search/' + query,
      {
        params,
      }
    );
  }
}
