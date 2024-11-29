import {
  AfterViewInit,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AuthSelectors } from '@core/stores/auth/auth.selectors';
import {
  InfiniteScrollCustomEvent,
  IonContent,
  ModalController,
} from '@ionic/angular';
import { PostComponent } from '@modals/post/post.component';
import { Store } from '@ngxs/store';
import { PostsService } from '@shared/services/posts/posts.service';
import { ScrollerService } from '@shared/services/segments-scroller/scroller.service';
import { FilterComponent } from './filter/filter.component';
import { NotificationComponent } from './notification/notification.component';
import { PostStore } from './post.store';
import { SearchComponent } from './search/search.component';

@Component({
  selector: 'app-main-picks',
  templateUrl: './main-picks.page.html',
  styleUrls: ['./main-picks.page.scss'],
  providers: [PostStore],
})
export class MainPicksPage implements AfterViewInit {
  private readonly postsService = inject(PostsService);
  private readonly modalController = inject(ModalController);
  private readonly scrollerService = inject(ScrollerService);
  private readonly store = inject(Store);
  private postStore = inject(PostStore);

  @ViewChild('menuPageTop') menuPageTop: IonContent;

  @ViewChildren('segmentButton', { read: ElementRef })
  segmentButtons: QueryList<ElementRef>;

  posts = toSignal(this.postsService.fetchPost$);
  isPosting = computed(() => this.postsService.isPosting());

  show_header: boolean = true;
  user = this.store.selectSignal(AuthSelectors.getUser);

  progress = 0;
  desiredScrollPosition = 100;

  constructor() {
    effect(() => {
      console.log('effect', this.postStore.posts());
    });
    setInterval(() => {
      this.progress += 0.01;
      if (this.progress > 1) {
        setTimeout(() => {
          this.progress = 0;
        }, 1000);
      }
    }, 50);
  }

  async ngAfterViewInit() {
    this.scrollerService.setSegmentButtons(this.segmentButtons);
    this.postsService.menuPageTop = this.menuPageTop;
    setTimeout(() => {
      this.applyScroll();
    }, 3000);
  }

  applyScroll() {
    console.log('apply scroll');

    setTimeout(() => {
      this.segmentButtons.forEach((segmentButton: ElementRef) => {
        const segmentEl = segmentButton.nativeElement;
        const currentScrollPosition = segmentEl.scrollLeft;
        if (currentScrollPosition < this.desiredScrollPosition) {
          segmentEl.scrollLeft = this.desiredScrollPosition;
        }
      });
    }, 1000);
  }

  ionViewWillEnter() {
    this.postsService.reload();
  }

  onScroll(event) {
    if (event.detail.deltaY > 0) {
      this.show_header = false;
    } else {
      this.show_header = true;
    }
  }

  doInfinite(ev: InfiniteScrollCustomEvent) {
    const currentPostsCount = this.posts().length;
    const limit = this.postsService.params().limit;
    if (currentPostsCount >= limit) {
      this.postsService.reload({
        skip: this.postsService.params().skip,
        limit: limit + 10,
      });
      setTimeout(() => {
        (ev as InfiniteScrollCustomEvent).target.complete();
      }, 500);
    } else {
      ev.target.complete();
    }
  }

  async openfilter() {
    const modal = await this.modalController.create({
      component: FilterComponent,
    });
    modal.onDidDismiss().then((result) => {
      console.log(result);
      if (result.role === 'cancel') {
        console.log('Modal dismissed');
      } else {
      }
    });
    await modal.present();
  }

  async openSearch() {
    const modal = await this.modalController.create({
      component: SearchComponent,
    });
    modal.onDidDismiss().then((result) => {
      console.log(result);
      if (result.role === 'cancel') {
        console.log('Modal dismissed');
      } else {
      }
    });
    await modal.present();
  }

  async openNotification() {
    const modal = await this.modalController.create({
      component: NotificationComponent,
    });
    modal.onDidDismiss().then((result) => {
      console.log(result);
      if (result.role === 'cancel') {
        console.log('Modal dismissed');
      } else {
      }
    });
    await modal.present();
  }

  async goToMainCreate(type) {
    const modal = await this.modalController.create({
      component: PostComponent,
      componentProps: {
        selected: type,
      },
    });

    await modal.present();
    this.applyScroll();
  }

  async handleRefresh(ev: any) {
    this.postsService.reload({
      skip: this.postsService.params().skip,
      limit: this.postsService.params().limit,
    });

    setTimeout(() => {
      ev.target.complete();
    }, 1500);
  }
}
