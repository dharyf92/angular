import { Component, inject, input, output } from '@angular/core';
import { PostUser } from '@core/models/post.model';
import { AppService } from '@shared/services/app/app.service';

@Component({
  selector: 'app-account-posts',
  templateUrl: './account-posts.component.html',
  styleUrls: ['./account-posts.component.scss'],
})
export class AccountPostsComponent {
  private readonly appService = inject(AppService);

  posts = input.required<PostUser[]>();

  reload = output<void>();

  async showPost(post: PostUser) {
    this.appService.showPost(post);
  }
}
