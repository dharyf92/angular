import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AccountInterestsPageRoutingModule } from './account-interests-routing.module';

import { AccountInterestsPage } from './account-interests.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AccountInterestsPageRoutingModule
  ],
  declarations: [AccountInterestsPage]
})
export class AccountInterestsPageModule {}
