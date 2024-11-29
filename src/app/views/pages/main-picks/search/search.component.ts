import { Component, inject, OnDestroy, signal } from '@angular/core';
import { Post } from '@core/models/post.model';
import { Picker } from '@core/models/user.model';
import { ModalController } from '@ionic/angular';
import { ApiService } from '@shared/services/api/api.service';
import { AppService } from '@shared/services/app/app.service';
import { PostsService } from '@shared/services/posts/posts.service';
import { isEmpty } from 'radash';
import { debounceTime, Subject } from 'rxjs';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnDestroy {
  private readonly apiService = inject(ApiService);
  private readonly modalController = inject(ModalController);
  private readonly appService = inject(AppService);
  private readonly postsService = inject(PostsService);

  searchInput = new Subject<string>();

  users = signal<Picker[]>([]);
  posts = signal<Post[]>([]);
  clips = signal<Post[]>([]);

  choice = 'Picks';

  constructor() {
    this.searchInput.pipe(debounceTime(400)).subscribe((searchTerm) => {
      this.search(searchTerm);
    });
  }

  ngOnDestroy(): void {
    this.searchInput.complete();
  }

  closeModalWithoutThem(): void {
    this.modalController.dismiss({}, 'cancel');
  }

  async showProfile(id: string) {
    this.appService.showProfile(id);
  }

  async getOnePost(post: Post) {
    this.appService.showPost(post);
    this.modalController.dismiss({ post }, 'done');
  }

  search(query: string) {
    if (isEmpty(query)) return;

    this.postsService.search(query).subscribe({
      next: (res) => {
        this.posts.set(res.picks);
        this.users.set(res.pickers);
        this.clips.set(res.clips);
      },
      error: (err: any) => {
        this.apiService.displayMessage(
          err.error.error,
          'danger',
          'warning-outline'
        );
      },
    });
  }

  onSearchInputChange(searchTerm: string) {
    this.posts.set([]);
    this.users.set([]);
    this.clips.set([]);
    this.searchInput.next(searchTerm);
  }
}
