import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SuccessNewPasswordPage } from './success-new-password.page';

const routes: Routes = [
  {
    path: '',
    component: SuccessNewPasswordPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SuccessNewPasswordPageRoutingModule {}
