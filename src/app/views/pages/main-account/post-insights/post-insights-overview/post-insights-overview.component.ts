import { Component, input } from '@angular/core';

type Stats = {
  views: number;
  shares: number;
  suggestions: number;
  picks: number;
};

@Component({
  selector: 'app-post-insights-overview',
  templateUrl: './post-insights-overview.component.html',
  styleUrls: ['./post-insights-overview.component.scss'],
})
export class PostInsightsOverviewComponent {
  stats = input.required<Stats>({ alias: 'stats' });
}
