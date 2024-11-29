import {
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { Post } from '@core/models/post.model';
import { AuthSelectors } from '@core/stores/auth/auth.selectors';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { Store } from '@ngxs/store';
import { SuggestionInputComponent } from '@shared/components/suggestion-list/suggestion-input/suggestion-input.component';
import { SuggestionListComponent } from '@shared/components/suggestion-list/suggestion-list.component';
import { SuggestionService } from '@shared/services/suggestion/suggestion.service';

@Component({
  selector: 'app-suggestion',
  templateUrl: './suggestion.component.html',
  styleUrls: ['./suggestion.component.scss'],
})
export class SuggestionComponent {
  private readonly suggestionService = inject(SuggestionService);
  private readonly modalController = inject(ModalController);
  private readonly actionSheetController = inject(ActionSheetController);
  private readonly store = inject(Store);

  findSuggestion = this.suggestionService.findSuggestion;
  suggestionInput = viewChild<SuggestionInputComponent>(
    SuggestionInputComponent
  );
  suggestionList = viewChild<SuggestionListComponent>(SuggestionListComponent);

  post = input.required<Post>();
  id = computed(() => this.post().id);

  user = this.store.selectSignal(AuthSelectors.getUser);
  type = signal<'edit' | 'add' | 'reply'>('add');
  selectedSuggestionId = signal('');

  getPickCount = computed(() => {
    const count = this.post().picks_count || 0;
    return count === 1 ? '1 Pick' : `${count} Picks`;
  });

  constructor() {
    effect(() => {
      this.suggestionService.add$$.subscribe(() => this.reset());
      this.suggestionService.delete$$.subscribe(() => this.reset());
      this.suggestionService.update$$.subscribe(() => this.reset());
    });
  }

  onSubmit(message: string) {
    const actions = {
      add: () => this.addSuggestion(message),
      edit: () => this.updateSuggestion(message),
      reply: () => this.replySuggestion(message),
    };

    actions[this.type()]();
  }

  private addSuggestion(message: string) {
    this.suggestionService.add$$.next({
      post_id: this.post().id,
      text_content: message,
      parent_suggestion_id: '',
      users_tag: [],
    });
  }

  private updateSuggestion(message: string) {
    this.suggestionService.update$$.next({
      id: this.selectedSuggestionId(),
      data: { text_content: message },
    });
  }

  private replySuggestion(message: string) {
    this.suggestionService.add$$.next({
      post_id: this.post().id,
      text_content: message,
      parent_suggestion_id: this.selectedSuggestionId(),
      users_tag: [],
    });
  }

  reset() {
    this.suggestionInput()?.reset();
    this.type.set('add');
    this.selectedSuggestionId.set('');
  }

  closeModalWithoutThem() {
    this.modalController.dismiss({}, 'cancel');
  }

  async showAction(id: string) {
    const buttons = this.createActionButtons(id);
    const actionSheet = await this.actionSheetController.create({ buttons });
    await actionSheet.present();
  }

  private createActionButtons(id: string) {
    const buttons = [
      this.createButton('Reply', () => this.setReplyMode(id)),
      this.createButton('Copy', () => console.log('Copy'), 'action-button'),
    ];

    const suggestion = this.findSuggestion(
      this.suggestionList()?.suggestions() || [],
      id
    );

    if (suggestion?.user.id === this.user().id) {
      buttons.push(
        this.createButton('Delete', () =>
          this.suggestionService.delete$$.next(id)
        ),
        this.createButton('Edit', () =>
          this.setEditMode(id, suggestion.text_content)
        )
      );
    } else {
      buttons.push(this.createButton('Report Comment', () => {}));
    }

    return buttons;
  }

  private createButton(text: string, handler: () => void, cssClass?: string) {
    return { text, handler, cssClass };
  }

  private setReplyMode(id: string) {
    this.type.set('reply');
    this.selectedSuggestionId.set(id);
    this.suggestionInput()?.reset();
  }

  private setEditMode(id: string, content: string) {
    this.selectedSuggestionId.set(id);
    this.suggestionInput()?.edit(content);
    this.type.set('edit');
  }
}
