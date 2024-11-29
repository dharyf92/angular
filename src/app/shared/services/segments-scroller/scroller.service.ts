import { ElementRef, Injectable, QueryList } from '@angular/core';
import { ApiService } from '@shared/services/api/api.service';
import { PostsService } from '../posts/posts.service';

@Injectable({
  providedIn: 'root',
})
export class ScrollerService {
  isLoading: boolean = false;
  allposts: any[] = [];
  offset: number = 0;
  limit: number = 100;
  clickCounter: number = 0;
  desiredScrollPosition: number = 100;

  segmentButtons: QueryList<ElementRef>;

  constructor(
    private apiService: ApiService,
    public postsService: PostsService
  ) {}
  //the function executes only when the user clicks the button twice while on the main page,
  //and does not execute when navigating back to the main page
  getPosts(): void {
    if (this.apiService.selectedTab === 'main-picks') {
      this.clickCounter++;
    } else {
      // Reset the counter if navigating back to the main page
      this.clickCounter = 0;
      return;
    }

    if (this.clickCounter < 2) {
      return;
    }

    // Reset the counter after the second click to avoid multiple executions
    this.clickCounter = 0;
    this.postsService.listPosts(this.offset, this.limit).subscribe(
      (res) => {
        this.scrollToTop();
        // this.postsService.allposts = res;
        this.postsService.allposts = res;
        // this.postsService.isLoading = false;
        this.applyScroll();
        console.log('main tab clicked');
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

  setSegmentButtons(segmentButtons: QueryList<ElementRef>) {
    this.segmentButtons = segmentButtons;
  }

  applyScroll() {
    setTimeout(() => {
      this.segmentButtons.forEach((segmentButton: ElementRef) => {
        const segmentEl = segmentButton.nativeElement;
        const currentScrollPosition = segmentEl.scrollLeft;
        if (currentScrollPosition < this.desiredScrollPosition) {
          segmentEl.scrollLeft = this.desiredScrollPosition; // Set the scroll position directly
        }
      });
    }, 3000);
  }
  scrollToTop() {
    this.postsService.menuPageTop.scrollToPoint(0, 0, 1000);
  }
}
