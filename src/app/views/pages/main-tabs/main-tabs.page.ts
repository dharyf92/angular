import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthSelectors } from '@core/stores/auth/auth.selectors';
import { IonContent, ModalController } from '@ionic/angular';
import { PostComponent } from '@modals/post/post.component';
import { Store } from '@ngxs/store';
import { ApiService } from '@shared/services/api/api.service';
import { AppService } from '@shared/services/app/app.service';
import { PostsService } from '@shared/services/posts/posts.service';
@Component({
  selector: 'app-main-tabs',
  templateUrl: './main-tabs.page.html',
  styleUrls: ['./main-tabs.page.scss'],
})
export class MainTabsPage implements OnInit {
  picture;
  offset = 0;
  limit = 100;
  imageUrl;
  user;
  notify: boolean = false;
  @ViewChild(IonContent) content: IonContent;
  constructor(
    private router: Router,
    private postsService: PostsService,
    public apiService: ApiService,
    private modalController: ModalController,
    private appService: AppService,
    private readonly store: Store
  ) {}

  setupListener() {}

  ngOnInit() {
    this.appService.initialize();
    this.appService.checkRegistered();
    this.user = this.store.selectSnapshot(AuthSelectors.getUser);
    this.imageUrl = this.user.avatar;
    let user_data = JSON.parse(localStorage.getItem('user'));

    this.picture = user_data?.profile_picture;
  }

  async goToMainCreate() {
    const modal = await this.modalController.create({
      component: PostComponent,
    });

    await modal.present();
  }

  goToNotifications() {
    this.router.navigate(['user-notifications']);
  }

  scrollToTop() {
    this.postsService.menuPageTop.scrollToPoint(0, 0, 1000);
  }
}
