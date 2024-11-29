import {
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  OnInit,
  signal,
  viewChild,
} from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Content, PickContent } from '@core/models/content.model';
import { Post } from '@core/models/post.model';
import { PostGateway } from '@core/ports/post.gateway';
import { AuthSelectors } from '@core/stores/auth/auth.selectors';
import {
  ActionSheetController,
  AlertController,
  ModalController,
} from '@ionic/angular';
import { Store } from '@ngxs/store';
import { SuggestionInputComponent } from '@shared/components/suggestion-list/suggestion-input/suggestion-input.component';
import { SuggestionListComponent } from '@shared/components/suggestion-list/suggestion-list.component';
import { AppService } from '@shared/services/app/app.service';
import { PostsService } from '@shared/services/posts/posts.service';
import { SuggestionService } from '@shared/services/suggestion/suggestion.service';
import { ReportPopUpComponent } from '@views/pages/main-picks/report-pop-up/report-pop-up.component';
import { alphabetical, max } from 'radash';
import { exhaustMap, lastValueFrom, merge, Subject, switchMap } from 'rxjs';
import { PostComponent } from '../post/post.component';

@Component({
  selector: 'app-one-post',
  templateUrl: './one-post.component.html',
  styleUrls: ['./one-post.component.scss'],
})
export class OnePostComponent implements OnInit {
  private readonly modalController = inject(ModalController);
  private readonly suggestionService = inject(SuggestionService);
  private readonly actionSheetController = inject(ActionSheetController);
  private readonly postsService = inject(PostsService);
  private readonly postGateway = inject(PostGateway);
  private readonly appService = inject(AppService);
  private readonly store = inject(Store);
  private readonly alertController = inject(AlertController);

  private readonly add$$ = this.suggestionService.add$$;
  private readonly delete$$ = this.suggestionService.delete$$;
  private readonly update$$ = this.suggestionService.update$$;

  suggestionList = viewChild<SuggestionListComponent>(SuggestionListComponent);
  suggestionInput = viewChild<SuggestionInputComponent>(
    SuggestionInputComponent
  );

  postType = computed(() =>
    this.post().expiration_date?.toLowerCase() === 'expired'
      ? 'closed'
      : 'ongoing'
  );

  user = this.store.selectSignal(AuthSelectors.getUser);

  postId = input.required<string>();

  pick$$ = new Subject<PickContent>();
  unPick$$ = new Subject<string>();

  pick$ = this.pick$$
    .asObservable()
    .pipe(
      exhaustMap((data: PickContent) => this.postsService.pickContent(data))
    );

  unPick$ = this.unPick$$
    .asObservable()
    .pipe(exhaustMap((id) => this.postsService.unPickContent(id)));

  post = toSignal(
    merge(toObservable(this.postId), this.unPick$, this.pick$).pipe(
      switchMap(() => this.postGateway.findOne(this.postId()))
    )
  );

  contents = computed(() =>
    this.postType() === 'closed'
      ? this.post().post_contents.filter(
          (c) =>
            c.picks_count ===
            max(this.post().post_contents.map((c) => c.picks_count))
        )
      : alphabetical(this.post().post_contents, (c) => c.id)
  );

  activeIndex = signal(0);

  svgContainer = viewChild.required<ElementRef>('svgContainer');

  selectedContent = computed(() => this.contents()[this.activeIndex()]);

  status = computed(() => this.selectedContent().pick_status);

  score = computed(() => this.selectedContent().score);

  type = signal<'edit' | 'add' | 'reply'>('add');

  selectedSuggestionId = signal('');

  constructor() {
    effect(() => {
      console.log(
        'effect',
        this.post(),
        this.appService.getPostExpirationDate(this.post().expiration_date),
        { postType: this.postType(), contents: this.contents() }
      );
      console.log(
        '🚀 ~ OnePostComponent ~ effect ~ this.contents():',
        this.contents()
      );
    });
  }

  async ngOnInit() {
    const res = await lastValueFrom(this.postsService.view(this.postId()));
    console.log(res);
  }

  private findSuggestion = this.suggestionService.findSuggestion;

  async showCloseConfirmation(post: Post) {
    const alert = await this.alertController.create({
      header: 'Confirm Close',
      message: 'Are you sure you want to close this post?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Confirm',
          handler: () => {
            const formData = new FormData();
            formData.append(
              'post',
              JSON.stringify({ expiration_date: '00:00:00:00' })
            );
            this.postsService.update$$.next({ data: formData, id: post.id });
          },
        },
      ],
    });

    await alert.present();
  }
  async updatePost(post: Post) {
    const modal = await this.modalController.create({
      component: PostComponent,
      componentProps: {
        isUpdate: true,
        post,
      },
    });
    await modal.present();
  }

  async showActionSheet() {
    const post = this.post();
    const buttons = [
      {
        text: 'Update',
        handler: () => this.updatePost(post),
        condition: post.user.id === this.user().id,
      },
      {
        text: 'Delete',
        handler: () => this.showDeleteConfirmation(post.id),
        condition: post.user.id === this.user().id,
      },
      {
        text: 'Close',
        handler: () => this.showCloseConfirmation(post),
        condition: post.user.id === this.user().id,
      },
      {
        text: 'Hide',
        handler: () => this.showHideConfirmation(post.id),
        condition: post.user.id !== this.user().id,
      },
      {
        text: 'Report',
        handler: () => this.openReportPopUp(post),
        condition: post.user.id !== this.user().id,
      },
    ]
      .filter((button) => button.condition)
      .map((button) => ({
        text: button.text,
        handler: button.handler,
      }));

    if (buttons.length > 0) {
      const actionSheet = await this.actionSheetController.create({
        header: 'Options',
        buttons: buttons,
      });

      await actionSheet.present();
    }
  }

  async showDeleteConfirmation(postId: string) {
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
          handler: () => this.postsService.delete$$.next(postId),
        },
      ],
    });

    await alert.present();
  }

  async openReportPopUp(post: Post) {
    const modal = await this.modalController.create({
      component: ReportPopUpComponent,
      componentProps: {
        post: post,
      },
    });
    await modal.present();
  }

  async showHideConfirmation(postId: string) {
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
          handler: () => this.postsService.hide$$.next(postId),
        },
      ],
    });

    await alert.present();
  }
  processTextContent() {
    return this.appService.highlightHashtag(this.post().text_content);
  }

  onHashtagClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (target.tagName === 'A') {
      const hashtag = target.innerText;
      this.appService.showHashtag(hashtag);
    }
  }

  like(id: string) {
    this.suggestionList().like(id);
  }

  getContents(contents: Content[]) {
    return alphabetical(contents, (c) => c.id);
  }

  private getStyles = computed(() => {
    if (this.score() >= 0 && this.score() < 20)
      return { left: 'calc(10% - 12px)', fill: '#D7D1F1' };
    if (this.score() >= 20 && this.score() < 40)
      return { left: 'calc(30% - 12px)', fill: '#ADA1E2' };

    if (this.score() >= 40 && this.score() < 60)
      return { left: 'calc(50% - 12px)', fill: '#8372D3' };

    if (this.score() >= 60 && this.score() < 80)
      return { left: 'calc(70% - 12px)', fill: '#5B44C5' };

    if (this.score() >= 80 && this.score() <= 100) {
      return { left: 'calc(90% - 12px)', fill: '#3409B7' };
    }
    return { left: 'calc(0% - 12px)', fill: '#D7D1F1' };
  });

  left = computed(() => this.getStyles().left);
  fill = computed(() => this.getStyles().fill);

  onClose() {
    this.modalController.dismiss();
  }

  onChangeIndex(index: number) {
    this.activeIndex.set(index);
  }

  onPick(status: boolean | null) {
    const foundPickStatusIndex = this.contents().findIndex(
      (item) => item.pick_status
    );

    console.log(foundPickStatusIndex);

    if (
      foundPickStatusIndex !== -1 &&
      this.contents()[foundPickStatusIndex].id !== this.selectedContent().id
    ) {
      return;
    }

    console.log(status);

    if (status === null) {
      this.unPick$$.next(this.selectedContent().id);
    } else {
      const position = this.contents().findIndex(
        (item) => item.id === this.selectedContent().id
      );
      this.pick$$.next({
        user_id: this.user().id,
        content_id: this.selectedContent().id,
        post_id: this.post().id,
        pick_status: status,
        item_position: this.appService.formatOrdinal(position + 1),
      });
    }

    this.animate(status);
  }

  isWithinTimeRange(expirationDate: string) {
    return this.appService.checkExpirationDateRange(expirationDate);
  }

  animate(status: boolean | null) {
    if (status === null) return;

    if (status) {
      this.svgContainer().nativeElement.classList.add('animate-svg-up');
      setTimeout(() => {
        this.svgContainer().nativeElement.classList.remove('animate-svg-up');
      }, 2000);
    } else {
      this.svgContainer().nativeElement.classList.add('animate-svg-up');
      setTimeout(() => {
        this.svgContainer().nativeElement.classList.remove('animate-svg-up');
      }, 2000);
    }
  }

  onSubmit(message: string) {
    this.add$$.subscribe(() => this.reset());
    this.delete$$.subscribe(() => this.reset());
    this.update$$.subscribe(() => this.reset());

    if (this.type() === 'add') {
      console.log({ message, type: this.type() });
      this.add$$.next({
        post_id: this.post().id,
        text_content: message,
        parent_suggestion_id: '',
        users_tag: [],
      });
    } else if (this.type() === 'edit') {
      this.update$$.next({
        id: this.selectedSuggestionId(),
        data: { text_content: message },
      });
    } else if (this.type() === 'reply') {
      this.add$$.next({
        post_id: this.post().id,
        text_content: message,
        parent_suggestion_id: this.selectedSuggestionId(),
        users_tag: [],
      });
    }
  }

  reset() {
    this.suggestionInput().reset();
    this.type.set('add');
    this.selectedSuggestionId.set('');
  }

  closeModalWithoutThem() {
    this.modalController.dismiss({}, 'cancel');
  }

  async showAction(id: string) {
    const createButton = (
      text: string,
      handler: () => void,
      cssClass?: string
    ) => ({
      text,
      cssClass,
      handler,
    });

    let buttons = [
      createButton('Reply', () => {
        this.type.set('reply');
        this.selectedSuggestionId.set(id);
        this.suggestionInput().reset();
      }),
      createButton('Copy', () => console.log('Copy'), 'action-button'),
    ];

    const suggestion = this.findSuggestion(
      this.suggestionList().suggestions(),
      id
    );

    const isCurrentUserSelected = suggestion?.user.id === this.user().id;

    if (isCurrentUserSelected) {
      buttons.push(
        createButton('Delete', () => this.delete$$.next(id)),
        createButton('Edit', () => {
          const suggestion = this.findSuggestion(
            this.suggestionList().suggestions(),
            id
          );
          if (suggestion) {
            this.selectedSuggestionId.set(id);
            this.suggestionInput().edit(suggestion.text_content);
            this.type.set('edit');
          }
        })
      );
    } else {
      buttons.push(createButton('Report Comment', () => {}));
    }

    const actionSheet = await this.actionSheetController.create({ buttons });
    await actionSheet.present();
  }
}
