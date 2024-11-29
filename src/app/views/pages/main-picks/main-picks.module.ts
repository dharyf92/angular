import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MainPicksPageRoutingModule } from './main-picks-routing.module';

import { MainPicksPage } from './main-picks.page';

import { HashtagComponent } from '@modals/hashtag/hashtag/hashtag.component';
import { ListUsersComponent } from '@modals/list-users/list-users.component';
import { LocationsComponent } from '@modals/locations/locations.component';
import { PostComponent } from '@modals/post/post.component';
import { SavedDetailsComponent } from '@modals/saved-details/saved-details.component';
import { SavedComponent } from '@modals/saved/saved.component';
import { ThemesComponent } from '@modals/themes/themes.component';
import { TimePickerComponent } from '@modals/time-picker/time-picker.component';
import { UpdateImageComponent } from '@modals/update-image/update-image.component';
import { UsersComponent } from '@modals/users/users.component';
import { TranslateModule } from '@ngx-translate/core';
import { AngularPinturaModule } from '@pqina/angular-pintura';
import { AvatarComponent } from '@shared/components/avatar/avatar.component';
import { ListPickerModule } from '@shared/components/list-picker/list-picker.module';
import { VideoEditorComponent } from '@shared/components/video-editor/video-editor.component';
import { ContrastDirective } from '@shared/directives/contrast.directive';
import { ScrollNearEndDirective } from '@shared/directives/scroll-near-end.directive';
import { SharedModule } from '@shared/modules/shared-module/SharedModule.module';
import { DurationPipe } from '@shared/pipes/duration.pipe';
import { FilterLocationPipe } from '@shared/pipes/filter-location.pipe';
import { FilterTitlePipe } from '@shared/pipes/filter-title.pipe';
import { HashtagPipe } from '@shared/pipes/hashtag.pipe';
import { ClipsVideoDetailsModule } from '@views/modals/clips-video-details/clips-video-details.module';
import { FilterOverviewComponent } from '@views/modals/filter-overview/filter-overview.component';
import { OnePostModule } from '@views/modals/one-post/one-post.module';
import { FilterComponent } from './filter/filter.component';
import { NotificationModule } from './notification/notification.module';
import { ReportPopUpComponent } from './report-pop-up/report-pop-up.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AngularPinturaModule,
    MainPicksPageRoutingModule,
    SharedModule,
    TranslateModule,
    AvatarComponent,
    ClipsVideoDetailsModule,
    VideoEditorComponent,
    OnePostModule,
    ContrastDirective,
    ListPickerModule,
    NotificationModule,
    ScrollNearEndDirective,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],

  declarations: [
    MainPicksPage,
    DurationPipe,
    ThemesComponent,
    ListUsersComponent,
    PostComponent,
    LocationsComponent,
    FilterOverviewComponent,
    HashtagPipe,
    HashtagComponent,
    UsersComponent,
    UpdateImageComponent,
    FilterComponent,
    FilterLocationPipe,
    TimePickerComponent,
    ReportPopUpComponent,
    SavedComponent,
    SavedDetailsComponent,
    FilterTitlePipe,
  ],
})
export class MainPicksPageModule {}
