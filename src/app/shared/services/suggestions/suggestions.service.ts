import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  CreateSuggestion,
  LikeSuggestion,
  Suggestion,
  UpdateSuggestion,
} from '@core/models/suggestion.model';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    Accept: 'application/json',
  }),
};

@Injectable({
  providedIn: 'root',
})
export class SuggestionsService {
  public isLoading = false;
  constructor(private http: HttpClient) {}

  retrieveAll(id: string) {
    return this.getSuggestions(id);
  }

  findSuggestion(suggestions: Suggestion[], id: string): Suggestion | null {
    for (const item of suggestions) {
      if (item.id === id) {
        return item;
      }
      if (item.sub_suggestion && item.sub_suggestion.length > 0) {
        const found = this.findSuggestion(item.sub_suggestion, id);
        if (found) return found;
      }
    }
    return null;
  }

  getSuggestions(
    postId: string,
    params: { skip: number; limit: number } = {
      skip: 0,
      limit: 100,
    }
  ): Observable<Suggestion[]> {
    const queryParams = new HttpParams()
      .set('offset', params.skip.toString())
      .set('limit', params.limit.toString());

    return this.http.get<Suggestion[]>(
      environment.serverUrl + '/api/suggestion/' + postId,
      {
        params: queryParams,
        ...httpOptions,
      }
    );
  }

  delete(id: string): Observable<any> {
    return this.http.delete(
      environment.serverUrl + '/api/suggestion/' + id,
      httpOptions
    );
  }

  like(data: LikeSuggestion): Observable<any> {
    return this.http.post(
      environment.serverUrl + '/api/pick/suggestion/',
      data,
      httpOptions
    );
  }

  unLike(id: string): Observable<any> {
    return this.http.delete(`/api/pick/suggestion/${id}`, httpOptions);
  }

  update(id: string, data: UpdateSuggestion): Observable<Suggestion> {
    return this.http.patch<Suggestion>(
      environment.serverUrl + '/api/suggestion/' + id,
      data,
      httpOptions
    );
  }

  add(data: CreateSuggestion): Observable<Suggestion> {
    const body = {
      text_content: data.text_content,
      parent_suggestion_id: data.parent_suggestion_id,
      users_tag: data.users_tag,
    };

    if (data.parent_suggestion_id === '') {
      delete body.parent_suggestion_id;
    }

    return this.http.post<Suggestion>(
      environment.serverUrl + '/api/suggestion/' + data.post_id,
      body,
      httpOptions
    );
  }

  reportComent(commentId: string) {
    let endpoint = 'report';
    let data = {
      report_type: ' ',
      content_type: 'post',
      content_id: commentId,
    };
    return this.http.post(environment.apiUrl + endpoint, data, httpOptions);
  }
}
