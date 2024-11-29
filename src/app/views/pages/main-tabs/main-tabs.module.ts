import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MainTabsPageRoutingModule } from './main-tabs-routing.module';

import { AvatarComponent } from '@shared/components/avatar/avatar.component';
import { SharedModule } from '@shared/modules/shared-module/SharedModule.module';
import { MainTabsPage } from './main-tabs.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MainTabsPageRoutingModule,
    SharedModule,
    AvatarComponent,
  ],
  declarations: [MainTabsPage],
})
export class MainTabsPageModule {}
