import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { Post } from '@core/models/post.model';
import { Picker } from '@core/models/user.model';
import { ModalController } from '@ionic/angular';
import { ApiService } from '@shared/services/api/api.service';
import { AppService } from '@shared/services/app/app.service';
import { PostsService } from '@shared/services/posts/posts.service';
import { UserService } from '@shared/services/user/user.service';
import { SearchComponent } from '../main-picks/search/search.component';

@Component({
  selector: 'app-main-discover',
  templateUrl: './main-discover.page.html',
  styleUrls: ['./main-discover.page.scss'],
})
export class MainDiscoverPage {
  choice: string = 'Ongoing';
  segments: string = 'Hotels';
  segments3: string = '';
  halfWidth = 0;
  posts: Post[] = [];
  pikers: Picker[] = [];
  listSuggestedPickers;
  listSuggestedPicks;
  constructor(
    private readonly router: Router,
    private readonly apiService: ApiService,
    readonly postsService: PostsService,
    private readonly modalController: ModalController,
    private readonly userService: UserService,
    private readonly appService: AppService
  ) {
    this.halfWidth = window.screen.width / 2;
  }
  ionViewWillEnter() {
    this.trendingPicks();
    this.trendingPickers();
    this.suggestedPickers();
    this.suggestedPicks();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.halfWidth = window.screen.width / 2;
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

  trendingPicks() {
    this.postsService.isTrendPicksLoading = true;
    this.postsService.trendingPosts().subscribe(
      (res) => {
        this.posts = res;
        this.listSuggestedPicks = res.toReversed(); // !: removed this line
        this.postsService.isTrendPicksLoading = false;
        console.log('res', res);
      },
      (erreur: any) => {
        this.apiService.displayMessage(
          erreur.error.error ?? 'Somthing went wrong, Please try again later',
          'danger',
          'warning-outline'
        );
      }
    );
  }

  trendingPickers() {
    this.postsService.isTrendPickersLoading = true;
    this.userService.trendingPickers().subscribe(
      (res) => {
        this.pikers = res;
        console.log('trandingPickers', res);
        this.postsService.isTrendPickersLoading = false;
      },
      (erreur: any) => {
        this.apiService.displayMessage(
          erreur.error.error ?? 'Somthing went wrong, Please try again later',
          'danger',
          'warning-outline'
        );
      }
    );
  }

  async showProfile(id: string) {
    console.log('id', id);

    this.appService.showProfile(id);
  }
  async getOnePost(post: Post) {
    this.appService.showPost(post);
  }

  sliceText(value, limit) {
    if (value.length <= limit) {
      return value;
    } else {
      return value.substring(0, limit) + '...';
    }
  }

  async openSearch() {
    const modal = await this.modalController.create({
      component: SearchComponent,
    });

    await modal.present();
  }

  showusers() {
    this.router.navigate(['/main-tabs/main-discover/users']);
    setTimeout(() => {
      this.postsService.setPickerData(this.pikers);
    }, 200);
  }

  showSuggestedPicker() {
    this.router.navigate(['/main-tabs/main-discover/users'], {
      queryParams: { param: 'isSuggested' },
    });
    setTimeout(() => {
      this.postsService.setPickerData(this.listSuggestedPickers);
    }, 200);
  }

  showpicks() {
    this.router.navigate(['/main-tabs/main-discover/picks']);
    setTimeout(() => {
      this.postsService.setPostData(this.posts);
    }, 200);
  }

  sugesstedPicks() {
    this.router.navigate(['/main-tabs/main-discover/picks'], {
      queryParams: { param: 'isSuggested' },
    });
    setTimeout(() => {
      this.postsService.setPostData(this.listSuggestedPicks);
    }, 200);
  }

  suggestedPickers() {
    this.postsService.isSuggestPickersLoading = true;

    this.userService.suggestedPickers().subscribe(
      (res) => {
        this.listSuggestedPickers = res;
        console.log('res', res);
        this.postsService.isSuggestPickersLoading = false;
      },
      (erreur: any) => {
        this.apiService.displayMessage(
          erreur.error.error ?? 'Somthing went wrong, Please try again later',
          'danger',
          'warning-outline'
        );
      }
    );
  }

  identifyPostType(post: Post) {
    return this.appService.identifyPostType(post.post_contents);
  }

  async getIP() {
    return fetch('https://api.ipify.org/?format=json').then((res) =>
      res.json()
    );
  }

  async suggestedPicks() {
    return;
    let ip = await this.getIP();
    let data = {
      host_ip: ip.ip,
    };
    this.postsService.isSuggestPicksLoading = true;
    this.postsService.suggestedPicks(data).subscribe((res: any) => {
      console.log(res);
      this.listSuggestedPicks = res;
      this.postsService.isSuggestPicksLoading = false;
    });
  }
}
