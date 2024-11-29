import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SignUpPage } from './sign-up.page';
import { VerifyPhoneNumberComponent } from './verify-phone-number/verify-phone-number.component';
import { VerifyPhoneNumberCodeComponent } from './verify-phone-number-code/verify-phone-number-code.component';

const routes: Routes = [
  {
    path: '',
    component: SignUpPage
  },
  {
    path: 'verify-phone-number',
    component: VerifyPhoneNumberComponent
  },{
    path: 'verify-phone-number-code',
    component: VerifyPhoneNumberCodeComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SignUpPageRoutingModule {}
