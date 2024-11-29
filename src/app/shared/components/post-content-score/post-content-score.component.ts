import { NgStyle } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { range } from 'radash';

@Component({
  standalone: true,
  imports: [NgStyle],
  selector: 'app-post-content-score',
  templateUrl: './post-content-score.component.html',
  styleUrls: ['./post-content-score.component.scss'],
})
export class PostContentScoreComponent {
  score = input.required<number>();

  elements = [...range(0, 4)];

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
}
