import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Picker } from '@core/models/user.model';
import { AppService } from '@shared/services/app/app.service';
import { PostsService } from '@shared/services/posts/posts.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-showusers',
  templateUrl: './showusers.component.html',
  styleUrls: ['./showusers.component.scss'],
})
export class ShowusersComponent implements OnInit, OnDestroy {
  users: Picker[];
  isSuggested = false;

  subscription: Subscription;
  constructor(
    private postsService: PostsService,
    private router: Router,
    private route: ActivatedRoute,
    private readonly appService: AppService
  ) {}

  ngOnInit() {
    this.subscription = this.postsService.pickerData$.subscribe((data) => {
      this.users = data;
      console.log('from show users component', this.users);
    });
    this.route.queryParams.subscribe((params) => {
      const paramValue = params['param'];
      this.isSuggested = paramValue;
      console.log('Param 1:', paramValue);
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  async showProfile(id: string) {
    this.appService.showProfile(id);
  }

  goBack() {
    this.router.navigate(['/main-tabs/main-discover']);
  }
}
