import { Component, computed, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Notification } from '@core/models/notification.model';
import { Post } from '@core/models/post.model';
import { Filter } from '@core/ports/post.gateway';
import { AuthActions } from '@core/stores/auth/auth.actions';
import {
  ActionSheetController,
  ModalController,
  Platform,
} from '@ionic/angular';
import { Store } from '@ngxs/store';
import { ApiService } from '@shared/services/api/api.service';
import { AppService } from '@shared/services/app/app.service';
import { CompletionService } from '@shared/services/completion/completion.service';
import { FcmService } from '@shared/services/fcm/fcm.service';
import {
  NotificationMutation,
  NotificationService,
} from '@shared/services/notification/notification.service';
import { PostsService } from '@shared/services/posts/posts.service';
import { UserService } from '@shared/services/user/user.service';
import { omit, range } from 'radash';
import { exhaustMap, merge, Subject, switchMap } from 'rxjs';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
})
export class NotificationComponent {
  private delete$$ = new Subject<NotificationMutation>();
  private view$$ = new Subject<NotificationMutation>();

  loaderArray: Array<number> = [...range(1, 9)];

  private delete$ = this.delete$$
    .asObservable()
    .pipe(
      exhaustMap((data) => this.notificationService.deleteNotification(data))
    );
  private view$ = this.view$$
    .asObservable()
    .pipe(exhaustMap((data) => this.notificationService.changeView(data)));

  filter = signal<Filter>({ limit: 10, skip: 0 });

  notifications = toSignal(
    merge(toObservable(this.filter), this.view$, this.delete$).pipe(
      switchMap(() => this.notificationService.getListNotification())
    )
  );

  today = computed(() => this.notifications().today);
  this_week = computed(() => this.notifications().this_week);
  this_month = computed(() => this.notifications().this_month);

  ionViewWillEnter() {
    this.refresh();
  }

  constructor(
    private modalController: ModalController,
    private notificationService: NotificationService,
    private postsService: PostsService,
    private apiService: ApiService,
    private userService: UserService,
    private actionSheetController: ActionSheetController,
    private completionService: CompletionService,
    private store: Store,
    private fcm: FcmService,
    private platform: Platform,
    private readonly appService: AppService
  ) {
    this.platform
      .ready()
      .then(() => {
        this.fcm.initPush();
        if (this.fcm.getToken()) {
          let fdata = new FormData();
          fdata.append(
            'data',
            JSON.stringify({ is_notification_allowed: true })
          );
          this.completionService.complete(fdata).subscribe(
            (res) => {
              this.store.dispatch(new AuthActions.SaveUser(res));
            },
            (erreur: any) => {
              this.apiService.displayMessage(
                erreur.error.error,
                'danger',
                'warning-outline'
              );
            }
          );
        }
      })
      .catch((e) => {
        console.log('error fcm: ', e);
      });
  }

  closeModalWithoutThem() {
    this.modalController.dismiss({}, 'cancel');
  }

  deleteNotification(notification: Notification) {
    const data = {
      post_id: notification.post_id,
      action: notification.action,
      content_id: notification.content_id,
      comment_id: notification.comment_id,
      id: notification.id,
    };

    let tmp: NotificationMutation;

    if (notification.comment_id) {
      tmp = omit(data, ['content_id', 'post_id', 'id']);
    } else if (notification.content_id) {
      tmp = omit(data, ['comment_id', 'post_id', 'id']);
    } else if (notification.post_id) {
      tmp = omit(data, ['content_id', 'comment_id', 'id']);
    } else {
      tmp = omit(data, ['content_id', 'comment_id', 'post_id']);
    }

    this.notificationService.deleteNotification(tmp).subscribe();
  }

  async showProfile(id: string) {
    await this.appService.showProfile(id);
  }

  async showActionSheet(notification: Notification) {
    const buttons = [
      {
        text: 'Block ' + notification.user.full_name,
        handler: () => {
          this.blockUser(notification.user.id);
        },
      },
      {
        text: 'Notifications settings',
        handler: () => {
          this.apiService.switchTab('main-account');
          this.closeModalWithoutThem();
        },
      },
    ].filter(Boolean);

    if (buttons.length > 0) {
      const actionSheet = await this.actionSheetController.create({
        header: 'Options',
        buttons: buttons,
      });

      await actionSheet.present();
    }
  }

  refresh() {
    this.filter.set({ ...this.filter() });
  }

  blockUser(user: string) {
    this.userService.blockUser(user).subscribe(
      (res) => {
        this.refresh();
      },
      (error) => {
        this.apiService.displayMessage(
          error.error.detail,
          'danger',
          'warning-outline'
        );
      }
    );
  }

  getPost(notification: Notification) {
    let data = {
      post_id: notification.post_id,
      action: notification.action,
      content_id: notification.content_id,
      comment_id: notification.comment_id,
      id: notification.id,
      is_viewed: true,
    };
    let tmp: NotificationMutation;

    if (notification.comment_id) {
      tmp = omit(data, ['content_id', 'post_id', 'id']);
    } else if (notification.content_id) {
      tmp = omit(data, ['comment_id', 'post_id', 'id']);
    } else if (notification.post_id) {
      tmp = omit(data, ['content_id', 'comment_id', 'id']);
    } else {
      tmp = omit(data, ['content_id', 'comment_id', 'post_id']);
    }

    this.view$$.next(tmp);

    this.postsService.get(notification.post_id).subscribe({
      next: (post) => this.appService.showPost(post),
      error: (error) => {
        this.apiService.displayMessage(
          error.error.detail,
          'danger',
          'warning-outline'
        );
      },
    });
  }

  async openSuggestions(post: Post) {
    this.appService.showSuggestions(post);
  }
}
