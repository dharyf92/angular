import { Component, computed, input, output } from '@angular/core';
import { Post, PostDataStudio } from '@core/models/post.model';
import { first } from 'radash';

@Component({
  selector: 'app-post-insights-item',
  templateUrl: './post-insights-item.component.html',
  styleUrls: ['./post-insights-item.component.scss'],
})
export class PostInsightsItemComponent {
  post = input.required<PostDataStudio>();

  type = computed(() => this.identifyPostType(this.post()));
  isClip = computed(() =>
    this.post().post_contents.some((item) => item.thumbnail.url)
  );

  content = computed(() => {
    if (this.isClip()) {
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

  getPost = output<PostDataStudio>();

  identifyPostType(
    post: Pick<Post, 'post_contents'>
  ): 'saved' | 'media' | 'questions' {
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
