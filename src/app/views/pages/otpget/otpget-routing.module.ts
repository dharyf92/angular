import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OtpgetPage } from './otpget.page';

const routes: Routes = [
  {
    path: '',
    component: OtpgetPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OtpgetPageRoutingModule {}
