import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AccountInterestsPage } from './account-interests.page';

const routes: Routes = [
  {
    path: '',
    component: AccountInterestsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccountInterestsPageRoutingModule {}
