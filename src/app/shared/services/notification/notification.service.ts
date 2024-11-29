import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Notification } from '@core/models/notification.model';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const httpOptions2 = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

type NotificationResponse = {
  today: Notification[];
  this_week: Notification[];
  this_month: Notification[];
};

export type NotificationMutation =
  | {
      comment_id: string;
      action: string;
      is_viewed?: boolean;
    }
  | {
      content_id: string;
      action: string;
      is_viewed?: boolean;
    }
  | {
      post_id: string;
      action: string;
      is_viewed?: boolean;
    }
  | {
      id: string;
      action: string;
      is_viewed?: boolean;
    };

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(private http: HttpClient) {}

  getListNotification(
    params = { limit: 10, offset: 0 }
  ): Observable<NotificationResponse> {
    return this.http.get<NotificationResponse>(
      environment.serverUrl + '/api/notification/',
      {
        params,
        ...httpOptions2,
      }
    );
  }

  deleteNotification(data: NotificationMutation): Observable<any> {
    return this.http.delete(
      environment.serverUrl + '/api/notification/',

      httpOptions2
    );
  }

  changeView(data: NotificationMutation): Observable<any> {
    return this.http.patch<any>(
      environment.serverUrl + '/api/notification/',
      data,
      httpOptions2
    );
  }
}
