import { Component, computed, inject, input, output } from '@angular/core';
import { Post } from '@core/models/post.model';
import { AppService } from '@shared/services/app/app.service';
import { alphabetical } from 'radash';

@Component({
  selector: 'app-post-list-item',
  templateUrl: './post-list-item.component.html',
  styleUrls: ['./post-list-item.component.scss'],
})
export class PostListItemComponent {
  private appService = inject(AppService);

  post = input.required<Post>();

  contents = computed(() =>
    alphabetical(this.post().post_contents, (c) => c.id)
  );

  profile = output<string>();
  action = output<Post>();
  hashtag = output<string>();
  share = output<Post>();
  showSuggestions = output<Post>();
  listViewers = output<string>();
  getPost = output<Post>();
  showPickers = output<string>();

  onShowViewers() {
    this.showPickers.emit(this.post().id);
  }

  onGetPost() {
    this.getPost.emit(this.post());
  }

  onListViewers(id: string) {
    this.listViewers.emit(id);
  }

  onShowSuggestions() {
    this.showSuggestions.emit(this.post());
  }

  onShare() {
    this.share.emit(this.post());
  }

  onShowProfile() {
    this.profile.emit(this.post().user.id);
  }

  onShowAction() {
    this.action.emit(this.post());
  }

  onHashtagClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (target.tagName === 'A') {
      const hashtag = target.innerText;
      this.hashtag.emit(hashtag);
    }
  }

  identifyPostType(post: Post): 'saved' | 'media' | 'questions' {
    if (post.post_contents && post.post_contents.length > 0) {
      const content = post.post_contents[0];
      if (content.image_url || content.link_url) {
        return 'saved';
      } else if (content.question_text) {
        return 'questions';
      }
    }
    return 'media';
  }

  processTextContent() {
    return this.appService.highlightHashtag(this.post().text_content);
  }

  isWithinTimeRange(expirationDate: string) {
    return this.appService.checkExpirationDateRange(expirationDate);
  }
}
