import { Component, computed, inject, input, output } from '@angular/core';
import { PostDataStudio } from '@core/models/post.model';
import { ContrastDirective } from '@shared/directives/contrast.directive';
import { AppService } from '@shared/services/app/app.service';
import { first } from 'radash';

@Component({
  standalone: true,
  imports: [ContrastDirective],
  selector: 'app-post-list-horizontal',
  templateUrl: './post-list-horizontal.component.html',
  styleUrls: ['./post-list-horizontal.component.scss'],
})
export class PostListHorizontalComponent {
  private readonly appService = inject(AppService);

  post = input.required<PostDataStudio>();

  isClip = computed(() =>
    this.post().post_contents.some((item) => item.thumbnail.url)
  );

  type = computed(() =>
    this.appService.identifyPostType(this.post().post_contents)
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

  onGetPost() {
    this.getPost.emit(this.post());
  }
}
