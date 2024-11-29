import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SignUpPageRoutingModule } from './sign-up-routing.module';

import { SharedModule } from '@shared/modules/shared-module/SharedModule.module';
import { CodeInputModule } from 'angular-code-input';
import { SignUpPage } from './sign-up.page';
import { VerifyPhoneNumberCodeComponent } from './verify-phone-number-code/verify-phone-number-code.component';
import { VerifyPhoneNumberComponent } from './verify-phone-number/verify-phone-number.component';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SignUpPageRoutingModule,
    CodeInputModule,
    SharedModule,
    ReactiveFormsModule,
  ],
  declarations: [
    SignUpPage,
    VerifyPhoneNumberComponent,
    VerifyPhoneNumberCodeComponent,
  ],
})
export class SignUpPageModule {}
