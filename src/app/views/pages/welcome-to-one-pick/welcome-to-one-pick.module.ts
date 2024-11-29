import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WelcomeToOnePickPageRoutingModule } from './welcome-to-one-pick-routing.module';

import { WelcomeToOnePickPage } from './welcome-to-one-pick.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WelcomeToOnePickPageRoutingModule
  ],
  declarations: [WelcomeToOnePickPage]
})
export class WelcomeToOnePickPageModule {}
