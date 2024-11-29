import { Observable } from 'rxjs';
import { Post, PostDataStudio, PostInsights } from '../models/post.model';

export type Filter = {
  limit: number;
  skip: number;
};

type StatsFilter = Filter & {
  type: 'ongoing' | 'closed';
};

export abstract class PostGateway {
  abstract findAll(filter?: Filter): Observable<Post[]>;

  abstract findOne(id: string): Observable<Post>;

  abstract create(post: Post): Observable<Post>;

  abstract update(post: Post): Observable<Post>;

  abstract delete(id: string): Observable<Post>;

  abstract stats(filter: StatsFilter): Observable<PostDataStudio[]>;

  abstract getPostInsights(id: string): Observable<PostInsights>;
}
