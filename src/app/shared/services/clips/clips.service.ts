import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Share } from '@capacitor/share';
import { PickContent } from '@core/models/content.model';
import { Post as Clip } from '@core/models/post.model';
import { Filter } from '@core/ports/post.gateway';
import { exhaustMap, merge, Observable, Subject, switchMap, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiService } from '../api/api.service';
import { PostsService } from '../posts/posts.service';

const httpOptions2 = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

type ViewResponse = {
  views_length: number;
  picks_length: number;
};

@Injectable({
  providedIn: 'root',
})
export class ClipsService {
  private postsService = inject(PostsService);
  private http = inject(HttpClient);
  private apiService = inject(ApiService);

  add$$ = new Subject<FormData>();
  delete$$ = new Subject<string>();
  hide$$ = new Subject<string>();
  update$$ = new Subject<{ data: FormData; id: string }>();

  filter = signal<Filter>({ limit: 20, skip: 0 });

  private add$ = this.add$$
    .asObservable()
    .pipe(exhaustMap((data) => this.add(data)));

  private delete$ = this.delete$$
    .asObservable()
    .pipe(exhaustMap((id) => this.delete(id)));

  private hide$ = this.hide$$
    .asObservable()
    .pipe(exhaustMap((id) => this.hide(id)));

  private update$ = this.update$$
    .asObservable()
    .pipe(exhaustMap((data) => this.update(data.id, data.data)));

  clips = toSignal(
    merge(
      toObservable(this.filter),
      this.add$,
      this.delete$,
      this.hide$,
      this.update$
    ).pipe(
      switchMap(() => this.list()),
      tap((clips) => {
        this.apiService.dismissLoading();
        return clips;
      })
    )
  );

  reload() {
    this.filter.set({ ...this.filter() });
  }

  update(id: string, data: FormData): Observable<Clip> {
    return this.postsService.update(data, id);
  }

  hide(id: string): Observable<any> {
    return this.postsService.hide(id);
  }

  list(): Observable<Clip[]> {
    const params = new HttpParams().set('limit', '100').set('offset', '0');

    return this.http.get<Clip[]>(environment.serverUrl + '/api/posts/clips', {
      params,
      ...httpOptions2,
    });
  }

  view(id: string): Observable<ViewResponse> {
    return this.postsService.view(id);
  }

  delete(id: string): Observable<any> {
    return this.postsService.deletePost(id);
  }

  add(data: FormData): Observable<Clip> {
    return this.postsService.create(data);
  }

  get(id: string): Observable<Clip> {
    return this.postsService.get(id);
  }

  pick(data: PickContent) {
    return this.postsService.pickContent(data);
  }

  unpick(contentId: string) {
    return this.postsService.unPickContent(contentId);
  }

  share(clip: Clip) {
    return Share.share({
      title: "See clip's cool stuff",
      text: 'Really awesome thing you need to see right meow',
      url: 'http://localhost:8100/?main-clips/' + clip.id,
      dialogTitle: 'Share with buddies',
    });
  }

  getVideo(clip: Clip) {
    const foundVideo = clip.post_contents.find(
      (item) => item.video_path !== null
    );
    return foundVideo ? foundVideo.video_path : '';
  }

  getThumbnail(clip: Clip) {
    const foundVideo = clip.post_contents.find(
      (item) => item.video_path !== null
    );
    return foundVideo ? foundVideo.thumbnail.url : '';
  }
}
