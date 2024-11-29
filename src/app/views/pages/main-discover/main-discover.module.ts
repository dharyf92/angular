import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MainDiscoverPageRoutingModule } from './main-discover-routing.module';

import { AvatarComponent } from '@shared/components/avatar/avatar.component';
import { ContrastDirective } from '@shared/directives/contrast.directive';
import { SharedModule } from '@shared/modules/shared-module/SharedModule.module';
import { ListPickerModule } from '@shared/components/list-picker/list-picker.module';
import { MainDiscoverPage } from './main-discover.page';
import { ShowpicksComponent } from './showpicks/showpicks.component';
import { ShowusersComponent } from './showusers/showusers.component';
import { TrendingPostItemComponent } from './trending-post-item/trending-post-item.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MainDiscoverPageRoutingModule,
    SharedModule,
    AvatarComponent,
    ContrastDirective,
    ListPickerModule,
  ],
  declarations: [
    MainDiscoverPage,
    ShowpicksComponent,
    ShowusersComponent,
    TrendingPostItemComponent,
  ],
})
export class MainDiscoverPageModule {}
