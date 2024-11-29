import { Component, computed, inject, input } from '@angular/core';
import { Share } from '@capacitor/share';
import { Post } from '@core/models/post.model';
import { AuthSelectors } from '@core/stores/auth/auth.selectors';
import {
  ActionSheetController,
  AlertController,
  ModalController,
} from '@ionic/angular';
import { Store } from '@ngxs/store';
import { AppService } from '@shared/services/app/app.service';
import { Filter, PostsService } from '@shared/services/posts/posts.service';
import { UserService } from '@shared/services/user/user.service';
import { ListUsersComponent } from '@views/modals/list-users/list-users.component';
import { PostComponent } from '@views/modals/post/post.component';
import { SuggestionComponent } from '@views/modals/suggestion/suggestion.component';
import { ReportPopUpComponent } from '../report-pop-up/report-pop-up.component';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss'],
})
export class PostListComponent {
  private readonly postsService = inject(PostsService);
  private readonly store = inject(Store);
  private readonly modalController = inject(ModalController);
  private readonly actionSheetController = inject(ActionSheetController);
  private readonly alertController = inject(AlertController);
  private readonly userService = inject(UserService);
  private readonly appService = inject(AppService);

  posts = input.required<Post[]>();
  isHashtag = input(false);

  skip = computed(() => this.postsService.params().skip);
  limit = computed(() => this.postsService.params().limit);

  user = this.store.selectSignal(AuthSelectors.getUser);

  async onShowProfile(userId: string) {
    await this.appService.showProfile(userId);
  }

  async onHashtagClick(hashtag: string) {
    if (!this.isHashtag()) {
      this.appService.showHashtag(hashtag);
    }
  }

  async showCloseConfirmation(post: Post) {
    const alert = await this.alertController.create({
      header: 'Confirm Close',
      message: 'Are you sure you want to close this post?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Confirm',
          handler: () => {
            const formData = new FormData();
            formData.append(
              'post',
              JSON.stringify({ expiration_date: '00:00:00:00' })
            );
            this.postsService.update$$.next({ data: formData, id: post.id });
          },
        },
      ],
    });

    await alert.present();
  }

  async updatePost(post: Post) {
    const modal = await this.modalController.create({
      component: PostComponent,
      componentProps: {
        isUpdate: true,
        post,
      },
    });
    await modal.present();
  }

  async showActionSheet(post: Post) {
    const buttons = [
      {
        text: 'Update',
        handler: () => this.updatePost(post),
        condition: post.user.id === this.user().id,
      },
      {
        text: 'Delete',
        handler: () => this.showDeleteConfirmation(post.id),
        condition: post.user.id === this.user().id,
      },
      {
        text: 'Close',
        handler: () => this.showCloseConfirmation(post),
        condition: post.user.id === this.user().id,
      },
      {
        text: 'Hide',
        handler: () => this.showHideConfirmation(post.id),
        condition: post.user.id !== this.user().id,
      },
      {
        text: 'Report',
        handler: () => this.openReportPopUp(post),
        condition: post.user.id !== this.user().id,
      },
    ]
      .filter((button) => button.condition)
      .map((button) => ({
        text: button.text,
        handler: button.handler,
      }));

    if (buttons.length > 0) {
      const actionSheet = await this.actionSheetController.create({
        header: 'Options',
        buttons: buttons,
      });

      await actionSheet.present();
    }
  }

  async showDeleteConfirmation(postId: string) {
    const alert = await this.alertController.create({
      header: 'Confirm Delete',
      message: 'Are you sure you want to delete this post?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Delete',
          handler: () => this.postsService.delete$$.next(postId),
        },
      ],
    });

    await alert.present();
  }

  async openReportPopUp(post: Post) {
    const modal = await this.modalController.create({
      component: ReportPopUpComponent,
      componentProps: {
        post: post,
      },
    });
    await modal.present();
  }

  async showHideConfirmation(postId: string) {
    const alert = await this.alertController.create({
      header: 'Confirm Hide',
      message: 'Are you sure you want to hide this post?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Hide',
          handler: () => this.postsService.hide$$.next(postId),
        },
      ],
    });

    await alert.present();
  }

  async listViewers(id: string, filter: Filter) {
    this.userService.listViewers(id).subscribe(async (list) => {
      const modal = await this.modalController.create({
        component: ListUsersComponent,
        componentProps: {
          list,
        },
      });
      await modal.present();
    });
  }

  async listPickers(postId: string) {
    const modal = await this.modalController.create({
      component: ListUsersComponent,
      componentProps: {
        postId,
      },
    });

    await modal.present();
  }
  async getOnePost(post: Post) {
    this.appService.showPost(post, () => {
      this.postsService.reload({ skip: this.skip(), limit: this.limit() });
    });
  }

  async onShowSuggestions(post: Post) {
    const modal = await this.modalController.create({
      component: SuggestionComponent,
      componentProps: {
        post,
      },
    });
    await modal.present();
  }

  async onShare(post: Post) {
    await Share.share({
      title: 'See cool stuff',
      text: 'Really awesome thing you need to see right meow',
      url: 'http://localhost:5500/?tagId=' + post.id,
      dialogTitle: 'Share with buddies',
    });
  }
}
