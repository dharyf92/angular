import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WelcomeToOnePickPage } from './welcome-to-one-pick.page';

const routes: Routes = [
  {
    path: '',
    component: WelcomeToOnePickPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WelcomeToOnePickPageRoutingModule {}
