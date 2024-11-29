import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MyUsersComponent } from '@modals/my-users/my-users.component';
import { ProfileComponent } from '@modals/profile/profile.component';
import { ViewerComponent } from '@modals/viewer/viewer.component';
import { AccountPostsModule } from '@shared/components/account-posts/account-posts.module';
import { AvatarComponent } from '@shared/components/avatar/avatar.component';
import { CroperComponent } from '@shared/components/croper/croper.component';
import { ListPickerModule } from '@shared/components/list-picker/list-picker.module';
import { ContrastDirective } from '@shared/directives/contrast.directive';
import { SharedModule } from '@shared/modules/shared-module/SharedModule.module';
import { ImageCropperModule } from 'ngx-image-cropper';
import { DataStudioModule } from './data-studio/data-studio.module';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { MainAccountPageRoutingModule } from './main-account-routing.module';
import { MainAccountPage } from './main-account.page';
import { PostInsightsModule } from './post-insights/post-insights.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MainAccountPageRoutingModule,
    SharedModule,
    ImageCropperModule,
    AvatarComponent,
    DataStudioModule,
    AccountPostsModule,
    ListPickerModule,
    PostInsightsModule,
    ContrastDirective,
  ],
  declarations: [
    MainAccountPage,
    ProfileComponent,
    EditProfileComponent,
    CroperComponent,
    MyUsersComponent,
    ViewerComponent,
  ],
})
export class MainAccountPageModule {}
