import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MainClipsPageRoutingModule } from './main-clips-routing.module';

import { ContrastDirective } from '@shared/directives/contrast.directive';
import { SharedModule } from '@shared/modules/shared-module/SharedModule.module';
import { MainClipsPage } from './main-clips.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    IonicModule,
    MainClipsPageRoutingModule,
    ContrastDirective,
  ],
  declarations: [MainClipsPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MainClipsPageModule {}
