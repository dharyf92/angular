import {
  Component,
  computed,
  effect,
  inject,
  input,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { Content } from '@core/models/content.model';
import { Post as Clip } from '@core/models/post.model';
import { AuthSelectors } from '@core/stores/auth/auth.selectors';
import {
  ActionSheetController,
  AlertController,
  ModalController,
} from '@ionic/angular';
import { Store } from '@ngxs/store';
import { AppService } from '@shared/services/app/app.service';
import { ClipsService } from '@shared/services/clips/clips.service';
import { ClipsVideoDetailsComponent } from '@views/modals/clips-video-details/clips-video-details.component';
import { ReportPopUpComponent } from '@views/pages/main-picks/report-pop-up/report-pop-up.component';
import { switchMap } from 'rxjs';
import { register } from 'swiper/element';

register();
@Component({
  selector: 'app-video-details',
  templateUrl: './video-details.component.html',
  styleUrls: ['./video-details.component.scss'],
})
export class VideoDetailsComponent implements OnInit {
  private readonly store = inject(Store);
  private readonly modalController = inject(ModalController);
  private readonly appService = inject(AppService);
  private readonly clipsService = inject(ClipsService);
  private readonly alertController = inject(AlertController);
  private readonly actionSheetController = inject(ActionSheetController);

  user = this.store.selectSignal(AuthSelectors.getUser);

  getThumbnail = this.clipsService.getThumbnail;

  data = input.required<Clip>({ alias: 'clip' });
  isFinished = input.required<boolean>();

  viewSuggestions = output<Clip>();
  pick = output<boolean | null>();
  share = output<Clip>();

  fetchedClip = signal<Clip | undefined>(undefined);
  clip = computed(() => this.fetchedClip() || this.data());

  constructor() {
    effect(() => {
      if (this.isFinished()) {
        this.clipsService
          .view(this.data().id)
          .pipe(switchMap(() => this.getClip()))
          .subscribe((clip) => this.fetchedClip.set(clip));
      }
    });
  }

  ngOnInit(): void {
    this.getClip().subscribe((clip) => this.fetchedClip.set(clip));
  }

  getClip() {
    return this.clipsService.get(this.data().id);
  }

  getFiles(files: Content[]) {
    return files.filter((item) => item.image_path.url);
  }

  onShare() {
    this.share.emit(this.clip());
  }

  onPick(data: { id: string; status: boolean | null; position: number }) {
    if (data.status === null) {
      this.clipsService
        .unpick(data.id)
        .pipe(switchMap(() => this.getClip()))
        .subscribe((clip) => {
          this.fetchedClip.set(clip);
          this.pick.emit(data.status);
        });
    } else {
      this.clipsService
        .pick({
          user_id: this.user().id,
          content_id: data.id,
          post_id: this.clip().id,
          pick_status: data.status,
          item_position: this.appService.formatOrdinal(data.position + 1),
        })
        .pipe(switchMap(() => this.getClip()))
        .subscribe((clip) => {
          this.fetchedClip.set(clip);
          this.pick.emit(data.status);
        });
    }
  }

  async onViewSuggestions() {
    this.appService.showSuggestions(this.clip(), () => {
      this.getClip().subscribe((clip) => {
        this.fetchedClip.set(clip);
      });
    });
  }

  async showProfile(id: string) {
    this.appService.showProfile(id);
  }

  async showDeleteConfirmation() {
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
          handler: () => {
            this.clipsService.delete$$.next(this.clip().id);
          },
        },
      ],
    });

    await alert.present();
  }

  async showHideConfirmation() {
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
          handler: () => {
            this.clipsService.hide$$.next(this.clip().id);
          },
        },
      ],
    });
    await alert.present();
  }

  getPostType() {
    const type = this.clip().post_contents.find((item) => item);
    if (type.question_text) {
      return 'question';
    } else if (this.clip().post_contents.length > 1) {
      return 'media';
    }
    return 'question';
  }

  async updateClip() {
    const modal = await this.modalController.create({
      component: ClipsVideoDetailsComponent,
      componentProps: {
        post: this.clip(),
        isUpdate: true,
        thumbnail: {
          image_url: this.getThumbnail(this.clip()),
        },
      },
    });
    await modal.present();
  }

  async showActions() {
    let buttons = [];

    if (this.user().id === this.clip().user.id) {
      buttons = [
        {
          text: 'Update',
          handler: async () => {
            await this.updateClip();
          },
        },
        {
          text: 'Delete',
          handler: async () => {
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
                  handler: () => {
                    this.clipsService.delete$$.next(this.clip().id);
                  },
                },
              ],
            });
            await alert.present();
          },
        },
      ];
    } else {
      buttons = [
        {
          text: 'Hide',
          handler: () => {
            this.showHideConfirmation();
          },
        },
        {
          text: 'Report',
          handler: () => {
            this.showReport();
          },
        },
      ];
    }

    const actionSheet = await this.actionSheetController.create({
      header: 'Options',
      buttons: buttons,
    });
    await actionSheet.present();
  }
  async showReport() {
    const modal = await this.modalController.create({
      component: ReportPopUpComponent,
      componentProps: {
        post: this.clip(),
      },
    });
    modal.onDidDismiss().then((result) => {
      if (result.role === 'cancel') {
        console.log('Modal dismissed');
      } else {
        this.clipsService.reload;
      }
    });
    return await modal.present();
  }
}
