import { Component, computed, input, OnInit } from '@angular/core';
import { Post } from '@core/models/post.model';

@Component({
  selector: 'app-suggestion-status-bar',
  templateUrl: './suggestion-status-bar.component.html',
  styleUrls: ['./suggestion-status-bar.component.scss'],
})
export class SuggestionStatusBarComponent implements OnInit {
  post = input.required<Post>();

  getViewCount = computed(() => {
    if (!this.post().views_count) {
      return '0 View';
    }

    return this.post().views_count > 1
      ? this.post().views_count + ' Views'
      : '1 View';
  });

  getPickCount = computed(() => {
    if (!this.post().picks_count) {
      return '0 Pick';
    }

    return this.post().picks_count > 1
      ? this.post().picks_count + ' Picks'
      : '1 Pick';
  });

  getSuggestionCount = computed(() => {
    if (!this.post().suggestions_count) {
      return '0 Suggestion';
    }

    return this.post().suggestions_count > 1
      ? this.post().suggestions_count + ' Suggestions'
      : '1 Suggestion';
  });

  constructor() {}

  ngOnInit() {}
}
