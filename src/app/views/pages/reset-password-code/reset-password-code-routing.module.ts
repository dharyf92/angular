import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ResetPasswordCodePage } from './reset-password-code.page';

const routes: Routes = [
  {
    path: '',
    component: ResetPasswordCodePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ResetPasswordCodePageRoutingModule {}
