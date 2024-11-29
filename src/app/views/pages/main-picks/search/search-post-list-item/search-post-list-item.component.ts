import { Component, computed, input, output } from '@angular/core';
import { Post } from '@core/models/post.model';
import { first } from 'radash';

@Component({
  selector: 'app-search-post-list-item',
  templateUrl: './search-post-list-item.component.html',
  styleUrls: ['./search-post-list-item.component.scss'],
})
export class SearchPostListItemComponent {
  post = input.required<Post>();

  type = computed(() => this.identifyPostType(this.post()));

  content = computed(() => {
    if (this.post().is_clip) {
      return this.post().post_contents.find((item) => item.thumbnail.url);
    }
    if (this.type() === 'questions') {
      return first(this.post().post_contents);
    } else if (this.type() === 'media') {
      const content = this.post().post_contents.find(
        (item) => item.image_path.url
      );
      return content;
    } else {
      return this.post().post_contents[0];
    }
  });

  getPost = output<Post>();

  identifyPostType(post: Post): 'saved' | 'media' | 'questions' {
    if (post.post_contents && post.post_contents.length > 0) {
      const content = first(post.post_contents);
      if (content.image_url || content.link_url) {
        return 'saved';
      } else if (content.question_text) {
        return 'questions';
      }
    }
    return 'media';
  }

  onGetPost() {
    this.getPost.emit(this.post());
  }
}
