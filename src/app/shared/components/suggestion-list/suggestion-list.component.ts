import { Component, inject, input, output } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { AuthSelectors } from '@core/stores/auth/auth.selectors';
import { Store } from '@ngxs/store';
import { SuggestionService } from '@shared/services/suggestion/suggestion.service';
import { merge, switchMap } from 'rxjs';

@Component({
  selector: 'app-suggestion-list',
  templateUrl: './suggestion-list.component.html',
  styleUrls: ['./suggestion-list.component.scss'],
})
export class SuggestionListComponent {
  private readonly suggestionService = inject(SuggestionService);
  private readonly store = inject(Store);

  findSuggestion = this.suggestionService.findSuggestion;

  readonly like$$ = this.suggestionService.like$$;
  readonly unLike$$ = this.suggestionService.unLike$$;

  postId = input.required<string>();

  action = output<string>();

  user = this.store.selectSignal(AuthSelectors.getUser);
  suggestions = toSignal(
    merge(toObservable(this.postId), this.suggestionService.suggestions$).pipe(
      switchMap(() => this.suggestionService.retrieveAll(this.postId()))
    )
  );

  like(id: string) {
    const suggestion = this.findSuggestion(this.suggestions(), id);
    if (suggestion && !suggestion.pick_status) {
      this.like$$.next({
        post_id: this.postId(),
        suggestion_id: id,
        pick_status: true,
        user_id: this.user().id,
      });
    }
    if (suggestion && suggestion.pick_status) {
      this.unLike$$.next(id);
    }
  }

  onAction(id: string) {
    this.action.emit(id);
  }
}
