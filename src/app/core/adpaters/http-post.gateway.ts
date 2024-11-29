import { HttpClient, HttpParams } from '@angular/common/http';
import { inject } from '@angular/core';
import { Post, PostDataStudio, PostInsights } from '@core/models/post.model';
import { Filter, PostGateway } from '@core/ports/post.gateway';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

export class HttpPostGateway implements PostGateway {
  private readonly http = inject(HttpClient);

  findAll(filter: Filter = { skip: 0, limit: 20 }): Observable<Post[]> {
    return this.http.get<Post[]>(environment.serverUrl + '/api/posts/public/', {
      params: new HttpParams()
        .set('offset', filter.skip)
        .set('limit', filter.limit),
    });
  }
  findOne(id: string): Observable<Post> {
    return this.http.get<Post>(environment.serverUrl + '/api/post/' + id);
  }
  create(post: Post): Observable<Post> {
    throw new Error('Method not implemented.');
  }
  update(post: Post): Observable<Post> {
    throw new Error('Method not implemented.');
  }
  delete(id: string): Observable<Post> {
    throw new Error('Method not implemented.');
  }

  stats(
    filter: Filter & { type: 'ongoing' | 'closed' } = {
      skip: 0,
      limit: 10,
      type: 'ongoing',
    }
  ): Observable<PostDataStudio[]> {
    return this.http.get<PostDataStudio[]>(
      environment.serverUrl + '/api/posts/data-studio/statistics',

      {
        params: new HttpParams()
          .set('offset', filter.skip)
          .set('limit', filter.limit)
          .set('type', filter.type),
      }
    );
  }

  getPostInsights(id: string): Observable<PostInsights> {
    return this.http.get<PostInsights>(
      environment.serverUrl + '/api/post/insights/' + id
    );
  }
}
