import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Post } from '@core/models/post.model';
import { ModalController } from '@ionic/angular';
import { OnePostComponent } from '@modals/one-post/one-post.component';
import { ApiService } from '@shared/services/api/api.service';
import { PostsService } from '@shared/services/posts/posts.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-showpicks',
  templateUrl: './showpicks.component.html',
  styleUrls: ['./showpicks.component.scss'],
})
export class ShowpicksComponent implements OnInit, OnDestroy {
  posts!: Post[];
  private subscription: Subscription;
  halfWidth = 0;
  isTrending = true;
  isSuggested = false;
  constructor(
    private postsService: PostsService,
    private router: Router,
    private route: ActivatedRoute,
    private apiService: ApiService,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.halfWidth = window.screen.width / 2;
    this.subscription = this.postsService.postData$.subscribe((data) => {
      this.posts = data;
      console.log('from show pick component', this.posts);
    });
    // Retrieve parameters from URL
    this.route.queryParams.subscribe((params) => {
      const paramValue = params['param'];
      this.isSuggested = paramValue;
      // Now you can use param1Value and param2Value as needed
      console.log('Param 1:', paramValue);
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  ionViewWillEnter() {
    this.apiService.visibleTabs = false;
  }

  ionViewWillLeave() {
    this.apiService.visibleTabs = true;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.halfWidth = window.screen.width / 2;
  }

  sliceText(value, limit) {
    if (value?.length <= limit) {
      return value;
    } else {
      return value?.substring(0, limit) + '...';
    }
  }

  goBack() {
    this.router.navigate(['/main-tabs/main-discover']);
  }

  async getOnePost(post: any) {
    let questions = [];
    let files = [];
    post.questions.forEach((item) => {
      questions.push(item.id);
    });
    post.files.forEach((item) => {
      files.push(item.id);
    });
    let data = {
      questions: questions,
      files: files,
    };
    this.postsService.view(post.id).subscribe({
      next: async (res) => {
        const modal = await this.modalController.create({
          component: OnePostComponent,
          // Optional: Pass data to the modal
          componentProps: {
            res: res,
            post: post,
          },
        });
        modal.onDidDismiss().then((result) => {
          if (result.role === 'cancel') {
          } else {
          }
        });
        await modal.present();
      },
      error: (erreur: any) => {
        this.apiService.displayMessage(
          erreur.error.error ?? 'Somthing went wrong, Please try again later',
          'danger',
          'warning-outline'
        );
      },
    });
  }

  getColorByBgColor(hexColor) {
    if (!hexColor) {
      return '#000';
    }
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);

    let luminance = (r * 299 + g * 587 + b * 114) / 1000;
    return luminance >= 128 ? '#000' : '#fff';
  }
}
