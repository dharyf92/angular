import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { PostContentScoreComponent } from '@shared/components/post-content-score/post-content-score.component';
import { ContrastDirective } from '@shared/directives/contrast.directive';
import { SharedModule } from '@shared/modules/shared-module/SharedModule.module';
import { MapComponent } from '../../../../shared/components/map/map.component';
import { PostInsightsImagesComponent } from './post-insights-images/post-insights-images.component';
import { PostInsightsOverviewComponent } from './post-insights-overview/post-insights-overview.component';
import { PostInsightsItemComponent } from './post-insights-picks/post-insights-item/post-insights-item.component';
import { PostInsightsPicksComponent } from './post-insights-picks/post-insights-picks.component';
import { PostInsightsStatisticsComponent } from './post-insights-statistics/post-insights-statistics.component';
import { PostInsightsComponent } from './post-insights.component';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    SharedModule,
    ContrastDirective,
    PostContentScoreComponent,
    MapComponent,
  ],
  declarations: [
    PostInsightsComponent,
    PostInsightsImagesComponent,
    PostInsightsStatisticsComponent,
    PostInsightsOverviewComponent,
    PostInsightsPicksComponent,
    PostInsightsItemComponent,
  ],
  exports: [PostInsightsComponent, PostInsightsPicksComponent],
})
export class PostInsightsModule {}
