import { Component, computed, inject, input, output } from '@angular/core';
import { Suggestion } from '@core/models/suggestion.model';
import { AppService } from '@shared/services/app/app.service';

@Component({
  selector: 'app-suggestion-item-element',
  templateUrl: './suggestion-item-element.component.html',
  styleUrls: ['./suggestion-item-element.component.scss'],
})
export class SuggestionItemElementComponent {
  private readonly appService = inject(AppService);

  suggestion = input.required<Suggestion>();
  type = input<'main' | 'sub'>('main');

  id = computed(() => this.suggestion().id);

  like = output<string>();
  action = output<string>();

  onLike() {
    this.like.emit(this.id());
  }

  onAction() {
    console.log('on action', this.id());

    this.action.emit(this.id());
  }

  goToProfile(id: string) {
    console.log('go to profile', id);
    this.appService.showProfile(id);
  }
}
