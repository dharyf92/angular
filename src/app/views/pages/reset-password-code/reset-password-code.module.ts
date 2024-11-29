import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ResetPasswordCodePageRoutingModule } from './reset-password-code-routing.module';

import { ResetPasswordCodePage } from './reset-password-code.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ResetPasswordCodePageRoutingModule
  ],
  declarations: [ResetPasswordCodePage]
})
export class ResetPasswordCodePageModule {}
