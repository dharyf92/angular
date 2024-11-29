import { Component, input, output, signal } from '@angular/core';
import { Suggestion } from '@core/models/suggestion.model';

@Component({
  selector: 'app-suggestion-item',
  templateUrl: './suggestion-item.component.html',
  styleUrls: ['./suggestion-item.component.scss'],
})
export class SuggestionItemComponent {
  suggestion = input.required<Suggestion>();

  like = output<string>();
  action = output<string>();

  limit = signal(3);

  onLike(id: string) {
    this.like.emit(id);
  }

  onAction(id: string) {
    this.action.emit(id);
  }

  onLimitChange(limit: number) {
    this.limit.set(limit);
  }
}
