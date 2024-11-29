import { Component, computed, inject, input, output } from '@angular/core';
import { Post } from '@core/models/post.model';
import { AppService } from '@shared/services/app/app.service';
import { first } from 'radash';

@Component({
  selector: 'app-trending-post-item',
  templateUrl: './trending-post-item.component.html',
  styleUrls: ['./trending-post-item.component.scss'],
})
export class TrendingPostItemComponent {
  private readonly appService = inject(AppService);

  post = input.required<Post>();

  type = computed(() =>
    this.appService.identifyPostType(this.post().post_contents)
  );

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

  onGetPost() {
    this.getPost.emit(this.post());
  }
}
