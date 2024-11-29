import { inject, Injectable } from '@angular/core';
import {
  CreateSuggestion,
  LikeSuggestion,
  Suggestion,
  UpdateSuggestion,
} from '@core/models/suggestion.model';
import { exhaustMap, merge, Subject } from 'rxjs';
import { SuggestionsService } from '../suggestions/suggestions.service';

@Injectable({
  providedIn: 'root',
})
export class SuggestionService {
  private readonly suggestionsService = inject(SuggestionsService);

  add$$ = new Subject<CreateSuggestion>();
  delete$$ = new Subject<string>();
  update$$ = new Subject<{
    data: UpdateSuggestion;
    id: string;
  }>();
  like$$ = new Subject<LikeSuggestion>();
  unLike$$ = new Subject<string>();

  private readonly unLike$ = this.unLike$$
    .asObservable()
    .pipe(exhaustMap((id) => this.suggestionsService.unLike(id)));

  private readonly like$ = this.like$$
    .asObservable()
    .pipe(exhaustMap((data) => this.suggestionsService.like(data)));

  private readonly add$ = this.add$$
    .asObservable()
    .pipe(exhaustMap((data) => this.suggestionsService.add(data)));

  private readonly delete$ = this.delete$$
    .asObservable()
    .pipe(exhaustMap((id) => this.suggestionsService.delete(id)));

  private readonly update$ = this.update$$
    .asObservable()
    .pipe(
      exhaustMap((data) => this.suggestionsService.update(data.id, data.data))
    );

  suggestions$ = merge(
    this.add$,
    this.delete$,
    this.update$,
    this.like$,
    this.unLike$
  );

  retrieveAll(id: string) {
    return this.suggestionsService.getSuggestions(id);
  }

  findSuggestion(suggestions: Suggestion[], id: string): Suggestion | null {
    for (const item of suggestions) {
      if (item.id === id) {
        return item;
      }
      if (item.sub_suggestion && item.sub_suggestion.length > 0) {
        const found = this.findSuggestion(item.sub_suggestion, id);
        if (found) return found;
      }
    }
    return null;
  }
}
