import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { PickContent } from '@core/models/content.model';
import { Category, Post, SavedItem } from '@core/models/post.model';
import { Picker } from '@core/models/user.model';
import { omit } from 'radash';
import {
  BehaviorSubject,
  catchError,
  exhaustMap,
  map,
  merge,
  Observable,
  Subject,
  switchMap,
  throwError,
} from 'rxjs';
import { environment } from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'multipart/form-data',
    Accept: 'application/json',
  }),
};
const httpOptions2 = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    Accept: 'application/json',
  }),
};

type ViewResponse = {
  views_length: number;
  picks_length: number;
  suggestions_length: number;
};

export type Filter = {
  limit: number;
  skip: number;
};

type SearchResponse = {
  clips: Post[];
  pickers: Picker[];
  picks: Post[];
};

export type FilterData = {
  categories: string[];
  address: string;
  dateCase: 'A' | 'B' | 'C' | 'D' | '';
};

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  allposts: any = [];
  isLoading = false;
  isPosting = signal(false);

  isTrendPicksLoading = false;
  isSuggestPicksLoading = false;
  isTrendPickersLoading = false;
  isSuggestPickersLoading = false;
  menuPageTop: any;
  private dataSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  private readonly http = inject(HttpClient);

  private postData = new Subject<Post[]>();
  postData$ = this.postData.asObservable();

  private pickerData = new Subject<Picker[]>();
  pickerData$ = this.pickerData.asObservable();

  add$$ = new Subject<FormData>();
  delete$$ = new Subject<string>();
  hide$$ = new Subject<string>();
  update$$ = new Subject<{ data: FormData; id: string }>();

  private add$ = this.add$$
    .asObservable()
    .pipe(exhaustMap((data) => this.create(data)));

  private delete$ = this.delete$$
    .asObservable()
    .pipe(exhaustMap((id) => this.deletePost(id)));

  private hide$ = this.hide$$
    .asObservable()
    .pipe(exhaustMap((id) => this.hide(id)));

  private update$ = this.update$$
    .asObservable()
    .pipe(exhaustMap((data) => this.update(data.data, data.id)));

  params = signal<Filter>({ skip: 0, limit: 20 });

  reload(data?: Filter) {
    this.params.set(data ?? { ...this.params() });
  }

  fetchPost$ = merge(
    toObservable(this.params),
    this.add$,
    this.delete$,
    this.hide$,
    this.update$
  ).pipe(
    catchError((err) => {
      this.isPosting.set(false);
      this.isLoading = false;
      return throwError(() => new Error(err));
    }),
    switchMap(() => this.listPosts(this.params().skip, this.params().limit)),
    map((res) => {
      this.isPosting.set(false);
      this.isLoading = false;
      return res;
    })
  );

  resetParams() {
    this.params.set({ skip: 0, limit: 20 });
  }

  getThemes(): Observable<Category[]> {
    return this.http.get<Category[]>(
      environment.serverUrl + '/api/category/list',
      httpOptions2
    );
  }

  filter(
    data: FilterData,
    filter: Filter = { skip: 0, limit: 20 }
  ): Observable<Post[]> {
    const params = new HttpParams()
      .set('limit', filter.limit)
      .set('offset', filter.skip);

    return this.http.post<Post[]>(environment.serverUrl + '/api/filter', data, {
      params,
    });
  }

  listPickers(postId: string, filter: Filter): Observable<Picker[]> {
    const params = new HttpParams()
      .set('limit', filter.limit)
      .set('offset', filter.skip);

    console.log(filter);

    return this.http.get<Picker[]>(
      environment.serverUrl + '/api/pick/users/' + postId,
      {
        params,
        ...httpOptions2,
      }
    );
  }

  getCountries(place): Observable<any> {
    return this.http.get(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${place}.json?access_token=${environment.mapBoxToken}`,
      httpOptions2
    );
  }

  savedCategories(): Observable<SavedItem[]> {
    return this.http.get<SavedItem[]>(
      environment.serverUrl + '/api/save',
      httpOptions2
    );
  }

  create(data: FormData): Observable<Post> {
    return this.http.post<Post>(environment.serverUrl + '/api/post', data);
  }

  update(data: FormData, id: string): Observable<Post> {
    return this.http.patch<Post>(
      environment.serverUrl + '/api/post/' + id,
      data
    );
  }

  deletePost(id: any): Observable<any> {
    let endpoint = 'post/' + id;
    return this.http.delete(environment.apiUrl + endpoint, httpOptions);
  }

  listPosts(offset = 0, limit = 100): Observable<Post[]> {
    const params = new HttpParams().set('offset', offset).set('limit', limit);
    return this.http.get<Post[]>(environment.serverUrl + '/api/posts/public/', {
      params,
    });
  }

  pickContent(data: PickContent): Observable<any> {
    return this.http.post(
      environment.serverUrl + '/api/pick/content/',
      omit(data, ['item_position']),
      {
        params: new HttpParams().set('item_position', data.item_position),
        ...httpOptions2,
      }
    );
  }

  unPickContent(id: string): Observable<any> {
    return this.http.delete(
      environment.serverUrl + '/api/pick/content/' + id,
      httpOptions2
    );
  }

  pick_status(id: string, data, url): Observable<any> {
    return this.http.put(environment.apiUrl + url + '/' + id, data);
  }

  view(id: string): Observable<ViewResponse> {
    return this.http.post<ViewResponse>(
      environment.serverUrl + '/api/view/' + id,
      {}
    );
  }

  hide(id: string): Observable<any> {
    return this.http.post(environment.apiUrl + 'post/hide/' + id, {});
  }

  report(data): Observable<any> {
    return this.http.post(environment.apiUrl + 'report/', data, httpOptions2);
  }

  trendingPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(
      environment.serverUrl + '/api/posts/trending/'
    );
  }

  search(
    query: string,
    filter: Filter = { limit: 20, skip: 0 }
  ): Observable<SearchResponse> {
    const params = new HttpParams()
      .set('search', query)
      .set('limit', filter.limit)
      .set('offset', filter.skip);

    return this.http.get<SearchResponse>(
      environment.serverUrl + '/api/search',
      {
        params,
        ...httpOptions2,
      }
    );
  }

  setData(data: string) {
    console.log('form setdata', data);
    this.dataSubject.next(data);
  }

  getData() {
    console.log('from get data');
    return this.dataSubject.asObservable();
  }

  getImageBlob(url: string): Observable<Blob> {
    return this.http.get(url, { responseType: 'blob' });
  }

  setPostData(data: Post[]) {
    this.postData.next(data);
  }

  setPickerData(data: Picker[]) {
    this.pickerData.next(data);
  }

  suggestedPicks(data): Observable<any> {
    return this.http.post(
      environment.apiUrl + 'post/recommend_posts/',
      data,
      httpOptions2
    );
  }

  get(id: string): Observable<Post> {
    return this.http.get<Post>(
      environment.serverUrl + '/api/post/' + id,
      httpOptions2
    );
  }
}
