import {
  Component,
  ElementRef,
  HostListener,
  inject,
  Input,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { Post } from '@core/models/post.model';
import { AuthSelectors } from '@core/stores/auth/auth.selectors';
import { ModalController } from '@ionic/angular';
import { Store } from '@ngxs/store';
import { ApiService } from '@shared/services/api/api.service';
import { PostsService } from '@shared/services/posts/posts.service';
import { ScrollerService } from '@shared/services/segments-scroller/scroller.service';

@Component({
  selector: 'app-hashtag',
  templateUrl: './hashtag.component.html',
  styleUrls: ['./hashtag.component.scss'],
})
export class HashtagComponent implements OnInit {
  @Input() hashtag: string;
  @ViewChildren('segmentButton', { read: ElementRef })
  segmentButtons: QueryList<ElementRef>;
  private readonly store = inject(Store);
  user = this.store.selectSignal(AuthSelectors.getUser);
  halfWidth = 0;
  widthscreen = 0;
  processedText: string;
  posts: Post[] = [];
  skip = 0;
  imageUrl = '';
  serverUrl = '';
  desiredScrollPosition = 100;
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.halfWidth = window.screen.width / 2;
    this.widthscreen = window.screen.width;
  }

  constructor(
    private modalController: ModalController,
    public postsService: PostsService,
    private apiService: ApiService,
    private scrollerService: ScrollerService
  ) {
    this.halfWidth = window.screen.width / 2;
    this.widthscreen = window.screen.width;
  }

  ngOnInit() {
    this.getPosts();
  }
  ionViewWillEnter() {
    console.log('will enter');
    // const desiredScrollPosition = 100;
    this.skip = 0;
    this.serverUrl = '';

    if (this.user().avatar) {
      this.imageUrl = this.user().avatar.url;
    }

    this.applyScroll();
  }
  ionViewDidEnter() {
    console.log('did enter');
    this.applyScroll();
  }
  ionViewWillLeave() {
    console.log('will leave');
    this.applyScroll();
  }
  async getPosts() {
    this.postsService.isLoading = true;
    this.postsService.search(this.hashtag).subscribe({
      next: (res) => {
        this.posts = res.picks;
        this.postsService.isLoading = false;
      },
      error: (err: any) => {
        console.log(err.error.error.error);
        this.apiService.displayMessage(
          err.error.error,
          'danger',
          'warning-outline'
        );
      },
    });
  }
  applyScroll() {
    setTimeout(() => {
      this.segmentButtons.forEach((segmentButton: ElementRef) => {
        const segmentEl = segmentButton.nativeElement;
        const currentScrollPosition = segmentEl.scrollLeft;
        if (currentScrollPosition < this.desiredScrollPosition) {
          segmentEl.scrollLeft = this.desiredScrollPosition; // Set the scroll position directly
          console.log(
            `Scrolled: ${segmentEl}, from ${currentScrollPosition} to ${this.desiredScrollPosition}`
          );
        } else {
          console.log(
            `Already scrolled: ${segmentEl}, current position is ${currentScrollPosition}`
          );
        }
      });
    }, 1000);
  }

  closeModalWithoutThem() {
    this.modalController.dismiss({}, 'cancel');
    this.scrollerService.applyScroll();
  }
}
