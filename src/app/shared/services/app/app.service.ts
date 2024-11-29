import { inject, Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { App } from '@capacitor/app';
import { Content } from '@core/models/content.model';
import { Post, PostUser } from '@core/models/post.model';
import { AuthActions } from '@core/stores/auth/auth.actions';
import { AuthSelectors } from '@core/stores/auth/auth.selectors';
import { IonContent, ModalController } from '@ionic/angular';
import { Store } from '@ngxs/store';
import { ApiService } from '@shared/services/api/api.service';
import { HashtagComponent } from '@views/modals/hashtag/hashtag/hashtag.component';
import { OnePostComponent } from '@views/modals/one-post/one-post.component';
import { ProfileComponent } from '@views/modals/profile/profile.component';
import { SuggestionComponent } from '@views/modals/suggestion/suggestion.component';
import { first } from 'radash';
import { filter } from 'rxjs';
import { FirebaseAuthenticationService } from '../firebase-authentication/firebase-authentication.service';
import { PostsService } from '../posts/posts.service';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  private readonly store = inject(Store);
  private readonly modalController = inject(ModalController);
  private readonly apiService = inject(ApiService);
  private postService = inject(PostsService);

  private readonly firebaseAuthenticationService = inject(
    FirebaseAuthenticationService
  );

  // Bad practice, but it's the only way to access the content
  private content: IonContent | undefined;

  private histories: string[] = [];
  private cannotGoBackPages = [
    '/home',
    '/sign-in',
    '/sign-up',
    '/complete-profile',
    '/',
  ];
  constructor(private router: Router) {
    router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.updateHistory(event.url);
      });
  }

  setContent(content: IonContent) {
    this.content = content;
  }

  updateHistory(url: string) {
    if (
      this.cannotGoBackPages.includes(url) ||
      this.histories[this.histories.length - 1] === url
    ) {
      console.log('no update', { url });
      console.log('histories', { histories: this.histories });

      return;
    }

    this.histories = [...this.histories, url];
    console.log('updating', { url });
    console.log('histories', { histories: this.histories });
  }

  getPreviousUrl() {
    return this.histories[this.histories.length - 2];
  }

  goBack() {
    const previousUrl = this.getPreviousUrl();
    console.log({ previousUrl, histories: this.histories });
    this.histories.pop();

    if (previousUrl) {
      this.router.navigate([previousUrl], { replaceUrl: true });
      this.apiService.selectedTab = previousUrl.replace('/main-tabs/', '');
    } else {
      this.router.navigate(['/main-tabs/main-picks'], {
        replaceUrl: true,
      });

      this.histories = [];
      this.apiService.selectedTab = 'main-picks';
    }
  }

  setupListener() {
    App.addListener('backButton', async (data) => {
      const modal = await this.modalController.getTop();

      console.log({ histories: this.histories });

      if (modal) {
        if (this.postService.isPosting() === false) {
          return await modal.dismiss();
        }

        return this.apiService.displayMessage(
          'Please wait for the post to be posted',
          'danger',
          'warning-outline'
        );
      }

      if (this.router.url === '/complete-profile') {
        return;
      }

      if (
        this.router.url.includes('/sign-in') ||
        this.router.url.includes('/sign-up')
      ) {
        return this.router.navigate(['/home']);
      }

      if (
        data.canGoBack &&
        this.router.url !== '/main-tabs' &&
        this.router.url !== '/main-tabs/main-picks'
      ) {
        this.goBack();
      } else {
        if (this.content === undefined) {
          App.exitApp();
          return;
        }
        // scroll to top
        const element = await this.content.getScrollElement();
        const scrollTop = element.scrollTop;

        if (scrollTop !== 0) {
          element.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }
        App.exitApp();
      }
    });
  }
  getCurrentUrl() {
    return this.histories[this.histories.length - 1];
  }

  async checkRegistered() {
    const isAuthenticated = this.store.selectSnapshot(
      AuthSelectors.getIsAuthenticated
    );
    const user = await this.firebaseAuthenticationService.getCurrentUser();

    if (isAuthenticated && user) {
      const token = await this.firebaseAuthenticationService.getIdToken();

      this.store
        .dispatch(new AuthActions.VerifyToken({ idToken: token }))
        .subscribe(() => {
          const isAuthenticated = this.store.selectSnapshot(
            AuthSelectors.getIsAuthenticated
          );
          console.log(isAuthenticated);

          if (isAuthenticated && user) {
            this.router.navigate(['/main-tabs/main-picks'], {
              replaceUrl: true,
            });
          } else {
            this.router.navigate(['/sign-up'], { replaceUrl: true });
          }
        });
    }
  }

  checkNewUser(cb: Function) {
    const isNewUser = this.getIsNewUser();

    if (isNewUser) {
      cb();
    }
  }

  removeListener() {
    App.removeAllListeners();
  }

  getIsNewUser() {
    return localStorage.getItem('isNewUser') === 'true';
  }

  initialize() {
    localStorage.setItem('isNewUser', 'true');
  }

  signOut() {
    this.histories = [];
    this.apiService.visibleTabs = true;
    // TODO: find a better way to do this
    this.apiService.selectedTab = 'main-picks';
    this.store.dispatch(AuthActions.Logout).subscribe(async () => {
      const user = this.store.selectSnapshot(AuthSelectors.getUser);
      if (!user) {
        await this.firebaseAuthenticationService.signOut();
        this.router.navigate(['/sign-in'], { replaceUrl: true });
      }
    });
  }

  async showProfile<T = any>(id: string, cb?: (result: T) => void) {
    const user = this.store.selectSnapshot(AuthSelectors.getUser);
    console.log('user', { user, id });

    if (user.id === id) {
      this.apiService.switchTab('main-account');
      return;
    }

    const modal = await this.modalController.create({
      component: ProfileComponent,
      componentProps: {
        userId: id,
      },
    });
    await modal.present();

    if (cb) {
      await modal.onDidDismiss().then(cb);
    }
  }

  async showPost<T = any>(post: PostUser, cb?: (result: T) => void) {
    if (post.is_clip) {
      this.apiService.selectedTab = 'main-clips';
      this.router.navigate([`/main-tabs/main-clips/${post.id}`]);
      return;
    }
    const modal = await this.modalController.create({
      component: OnePostComponent,
      componentProps: {
        postId: post.id,
      },
    });

    await modal.present();

    if (cb) {
      await modal.onDidDismiss().then(cb);
    }
  }

  identifyPostType(contents: Content[]): 'saved' | 'media' | 'questions' {
    if (contents.length > 0) {
      const content = first(contents);
      if (content.image_url || content.link_url) {
        return 'saved';
      } else if (content.question_text) {
        return 'questions';
      }
    }
    return 'media';
  }

  getPostExpirationDate(date: string) {
    // add seconds to time units
    const timeUnits = {
      d: 24 * 60 * 60,
      h: 60 * 60,
      min: 60,
      sec: 1,
    };

    return date.split(' ').reduce((total, time) => {
      const unit = time.slice(-1);
      const value = parseInt(time);
      console.log({ unit, value, total });
      return total + timeUnits[unit] * value;
    }, 0);
  }

  checkExpirationDateRange(date: string) {
    const timeUnits = {
      d: 24 * 60 * 60,
      h: 60 * 60,
      min: 60,
    };

    const timeInMinutes = date.split(' ').reduce((total, time) => {
      const unit = time.slice(-1);
      const value = parseInt(time);
      return total + timeUnits[unit] * value;
    }, 0);

    if (timeInMinutes > 0 && timeInMinutes <= 15) {
      return 'red-bg';
    } else if (timeInMinutes > 15 && timeInMinutes <= 720) {
      return 'orange-bg';
    } else if (timeInMinutes > 720 && timeInMinutes <= 172800) {
      return 'yellow-bg';
    }
    return 'green-bg';
  }

  showSuggestions = async (post: Post, cb?: () => void) => {
    const modal = await this.modalController.create({
      component: SuggestionComponent,
      componentProps: {
        post,
      },
    });
    await modal.present();

    if (cb) {
      await modal.onDidDismiss().then(cb);
    }
  };

  async showHashtag(hashtag: string) {
    const modal = await this.modalController.create({
      component: HashtagComponent,
      componentProps: { hashtag },
    });
    await modal.present();
  }

  highlightHashtag(content: Post['text_content']) {
    const hashtagRegex = /(#\w+)/g;
    return content
      ? content.replace(hashtagRegex, '<span class="hashtag">$1</span>')
      : content;
  }

  formatOrdinal(n: number): string {
    const suffixes = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    return n + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
  }
}
