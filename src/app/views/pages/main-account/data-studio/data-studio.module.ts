import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { MapComponent } from '@shared/components/map/map.component';
import { PostListHorizontalComponent } from '@shared/components/post-list-horizontal/post-list-horizontal.component';
import { SharedModule } from '@shared/modules/shared-module/SharedModule.module';
import { PostInsightsModule } from '../post-insights/post-insights.module';
import { DataStudioComponent } from './data-studio.component';
import { OverviewComponent } from './overview/overview.component';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    SharedModule,
    PostInsightsModule,
    PostListHorizontalComponent,
    MapComponent,
  ],
  declarations: [DataStudioComponent, OverviewComponent],
  exports: [DataStudioComponent],
})
export class DataStudioModule {}
