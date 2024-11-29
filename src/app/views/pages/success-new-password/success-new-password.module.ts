import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SuccessNewPasswordPageRoutingModule } from './success-new-password-routing.module';

import { SuccessNewPasswordPage } from './success-new-password.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SuccessNewPasswordPageRoutingModule
  ],
  declarations: [SuccessNewPasswordPage]
})
export class SuccessNewPasswordPageModule {}
