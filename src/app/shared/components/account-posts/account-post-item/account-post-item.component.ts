import { Component, computed, input, output } from '@angular/core';
import { PostUser } from '@core/models/post.model';
import { first } from 'radash';

@Component({
  selector: 'app-account-post-item',
  templateUrl: './account-post-item.component.html',
  styleUrls: ['./account-post-item.component.scss'],
})
export class AccountPostItemComponent {
  post = input.required<PostUser>();

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

  getPost = output<PostUser>();

  identifyPostType(post: PostUser): 'saved' | 'media' | 'questions' {
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
