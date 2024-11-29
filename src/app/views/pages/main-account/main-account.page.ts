import { Component, computed, inject, signal } from '@angular/core';
import { ModalController, SegmentCustomEvent } from '@ionic/angular';
import { UserService } from '@shared/services/user/user.service';
import { EditProfileComponent } from '@views/pages/main-account/edit-profile/edit-profile.component';

import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { PostUser } from '@core/models/post.model';
import { AuthSelectors } from '@core/stores/auth/auth.selectors';
import { MyUsersComponent } from '@modals/my-users/my-users.component';
import { ViewerComponent } from '@modals/viewer/viewer.component';
import { Store } from '@ngxs/store';
import { AppService } from '@shared/services/app/app.service';
import { switchMap } from 'rxjs';

type Choice = 'ongoing' | 'closed';

@Component({
  selector: 'app-main-account',
  templateUrl: './main-account.page.html',
  styleUrls: ['./main-account.page.scss'],
})
export class MainAccountPage {
  private readonly modalController = inject(ModalController);
  private readonly userService = inject(UserService);
  private readonly store = inject(Store);
  private readonly appService = inject(AppService);

  showHeader = false;

  choice = signal<Choice>('ongoing');

  user = this.store.selectSignal(AuthSelectors.getUser);

  params = signal({ skip: 0, limit: 20 });

  profile = toSignal(
    toObservable(this.params).pipe(
      switchMap(() =>
        this.userService.getProfile(this.user().id, this.params())
      )
    )
  );

  ionViewWillEnter() {
    this.params.set({ ...this.params() });
  }

  changeSegment(event: SegmentCustomEvent) {
    this.choice.set(event.detail.value as Choice);
  }

  posts = computed(() => {
    if (this.choice() === 'ongoing') {
      return this.profile().ongoing_posts;
    } else {
      return this.profile().closed_posts;
    }
  });

  async getOnePost(post: PostUser) {
    console.log(post);

    this.appService.showPost(post, () => {
      this.refresh();
    });
  }

  async openProfileEditor() {
    const modal = await this.modalController.create({
      component: EditProfileComponent,
    });

    modal.onDidDismiss().then((result) => {
      if (result.role !== 'cancel') {
        this.refresh();
      }
    });
    await modal.present();
  }

  refresh = () => {
    this.params.set({ ...this.params() });
  };

  async viewUsers(choice: string) {
    console.log(choice);
    const modal = await this.modalController.create({
      component: MyUsersComponent,
      componentProps: {
        profile: this.profile(),
        choice,
      },
    });

    modal.onDidDismiss().then((result) => {
      if (result.role !== 'cancel') {
        this.refresh();
      }
    });
    await modal.present();
  }

  async openViewer(image: { url: string }, fullName: string) {
    console.log(image);
    const modal = await this.modalController.create({
      component: ViewerComponent,
      componentProps: {
        image: image.url,
        fullname: fullName,
      },
    });

    return await modal.present();
  }
}
