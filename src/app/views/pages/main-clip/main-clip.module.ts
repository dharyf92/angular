import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MainClipPageRoutingModule } from './main-clip-routing.module';

import { AvatarComponent } from '@shared/components/avatar/avatar.component';
import { ContrastDirective } from '@shared/directives/contrast.directive';
import { SharedModule } from '@shared/modules/shared-module/SharedModule.module';
import { MainClipPage } from './main-clip.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MainClipPageRoutingModule,
    AvatarComponent,
    SharedModule,
    ContrastDirective,
  ],
  declarations: [MainClipPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MainClipPageModule {}
