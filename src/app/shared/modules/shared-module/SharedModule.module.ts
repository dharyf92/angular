// shared.module.ts
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { InputTelComponent } from '@shared/components/input-tel/input-tel.component';
import { InterestsComponent } from '@shared/components/interests/interests.component';

import { AvatarComponent } from '@shared/components/avatar/avatar.component';
import { PickerComponent } from '@shared/components/picker/picker.component';
import { PostContentSliderComponent } from '@shared/components/post-content-slider/post-content-slider.component';
import { VideoComponent } from '@shared/components/video/video.component';
import { ContrastDirective } from '@shared/directives/contrast.directive';
import { TimeAgoPipe } from '@shared/pipes/time-ago.pipe';
import { ClipVideoRecorderModule } from '@views/modals/clip-video-recorder/clip-video-recorder.module';
import { VideoDetailsContentComponent } from '@views/pages/main-clips/video-details-questions/video-details-contents.component';
import { VideoDetailsComponent } from '@views/pages/main-clips/video-details/video-details.component';
import { PostListItemComponent } from '@views/pages/main-picks/post-list/post-list-item/post-list-item.component';
import { PostListComponent } from '@views/pages/main-picks/post-list/post-list.component';
import { SearchModule } from '@views/pages/main-picks/search/search.module';
import { SortPipe } from 'src/app/shared/pipes/sort.pipe';

@NgModule({
  declarations: [
    InterestsComponent,
    InputTelComponent,
    SortPipe,
    VideoComponent,
    VideoDetailsComponent,
    VideoDetailsContentComponent,
    PickerComponent,
    TimeAgoPipe,
    PostContentSliderComponent,
    PickerComponent,
    PostListComponent,
    PostListItemComponent,
  ],
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ClipVideoRecorderModule,
    SearchModule,
    AvatarComponent,
    ContrastDirective,
  ],
  exports: [
    InterestsComponent,
    InputTelComponent,
    SortPipe,
    IonicModule,
    VideoComponent,
    VideoDetailsComponent,
    VideoDetailsContentComponent,
    AvatarComponent,
    PickerComponent,
    TimeAgoPipe,
    PostContentSliderComponent,
    PickerComponent,
    PostListComponent,
    PostListItemComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SharedModule {}
