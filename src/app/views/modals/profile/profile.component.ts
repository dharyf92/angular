import {
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Post } from '@core/models/post.model';
import { Profile } from '@core/models/user.model';
import { AuthSelectors } from '@core/stores/auth/auth.selectors';
import {
  ActionSheetController,
  AlertController,
  ModalController,
  SegmentCustomEvent,
} from '@ionic/angular';
import { Store } from '@ngxs/store';
import { ApiService } from '@shared/services/api/api.service';
import { AppService } from '@shared/services/app/app.service';
import { UserService } from '@shared/services/user/user.service';
import { merge, switchMap } from 'rxjs';
import { MyUsersComponent } from '../my-users/my-users.component';
import { ViewerComponent } from '../viewer/viewer.component';

type Choice = 'ongoing' | 'closed';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent {
  private readonly userService = inject(UserService);
  private readonly apiService = inject(ApiService);
  private readonly modalController = inject(ModalController);
  private readonly actionSheet = inject(ActionSheetController);
  private readonly alertController = inject(AlertController);
  private readonly appService = inject(AppService);
  private readonly store = inject(Store);

  userId = input.required<string>();
  choice = signal<Choice>('ongoing');
  params = signal({ skip: 0, limit: 20 });
  currentUser = this.store.selectSignal(AuthSelectors.getUser);

  profile = toSignal(
    merge(toObservable(this.params)).pipe(
      switchMap(() => this.userService.getProfile(this.userId(), this.params()))
    )
  );

  constructor() {
    effect(() => {
      console.log('pick status: ', {
        status: this.profile()?.pick_status,
        pickedStatus: this.pickedStatus(),
      });
    });
  }

  posts = computed(() =>
    this.choice() === 'ongoing'
      ? this.profile().ongoing_posts
      : this.profile().closed_posts
  );

  pickedStatus = computed(() => {
    if (!this.profile()) return 'pending';

    const { pick_status } = this.profile();

    if (pick_status.is_my_follow_accepted) return 'picked';
    if (pick_status.is_follow_back && !pick_status.is_follow_accepted)
      return 'confirm';
    if (pick_status.is_follow_request && !pick_status.is_my_follow_accepted)
      return 'pending';
    return 'pick';
  });

  checkPik = computed(() => this.profile().pick_status.is_follow_accepted);
  checkPending = computed(() => this.profile().pick_status.is_follow_request);

  reload = () => {
    this.params.set({ ...this.params() });
  };

  getThumbnail = (data: { thumbnail: string }[]) =>
    data.find((item) => item.thumbnail)?.thumbnail || '';

  changeSegment = (event: SegmentCustomEvent) =>
    this.choice.set(event.detail.value as Choice);

  closeModalWithoutThem = () => this.modalController.dismiss({}, 'cancel');

  getOnePost = (post: Post) => this.appService.showPost(post);

  async openActionSheet() {
    const alert = await this.actionSheet.create({
      cssClass: 'my-custom-alert',
      buttons: [
        {
          text: `block ${this.profile().full_name}`,
          cssClass: 'color-danger',
          handler: () => this.blockUser(),
        },
        {
          text: 'Report',
          cssClass: 'action-button',
          handler: () => this.showReportConfirmation(this.profile().id),
        },
      ],
    });
    await alert.present();
  }

  private blockUser() {
    this.userService.blockUser(this.profile().id).subscribe({
      next: () => {
        this.reload();
        this.modalController.dismiss();
      },
      error: (err: any) => this.handleError(err),
    });
  }

  async showReportConfirmation(userId: string) {
    const alert = await this.alertController.create({
      header: 'Confirm Report',
      message: 'Are you sure you want to report this User?',
      buttons: [
        { text: 'Cancel', role: 'cancel', cssClass: 'secondary' },
        { text: 'Report', handler: () => this.reportUser(userId) },
      ],
    });
    await alert.present();
  }

  reportUser(id: string) {
    this.userService.reportUser(id).subscribe({
      next: () =>
        this.apiService.displayMessage(
          'The user has been reported successfully.',
          'light',
          'checkmark-circle-outline'
        ),
      error: (err: any) => this.handleError(err),
    });
  }

  pickUser() {
    const invitation_status = this.profile().is_private
      ? 'pending'
      : 'accepted';
    this.userService.pickUser(this.profile().id, invitation_status).subscribe({
      next: () => this.reload(),
      error: (err: any) => this.handleError(err),
    });
  }

  unPickUser() {
    this.userService.pickUser(this.profile().id, 'accepted').subscribe({
      next: this.reload,
      error: (err: any) => this.handleError(err),
    });
  }

  confirmUser() {
    this.userService.confirmPicker(this.profile().id).subscribe({
      next: this.reload,
      error: (err: any) => this.handleError(err),
    });
  }

  async viewUsers(choice: string) {
    const modal = await this.modalController.create({
      component: MyUsersComponent,
      componentProps: { profile: this.profile(), choice },
    });
    modal.onDidDismiss().then((result) => {
      if (result.role !== 'cancel') {
        this.currentUser = result.data.res;
      }
    });
    await modal.present();
  }

  async openViewer(image: Profile['avatar'], fullName: string) {
    const modal = await this.modalController.create({
      component: ViewerComponent,
      componentProps: { image: image.url, fullName },
    });
    return await modal.present();
  }

  private handleError(err: any) {
    this.apiService.displayMessage(
      err.error?.error || 'Something went wrong. Please try again later',
      'danger',
      'warning-outline'
    );
  }
}
