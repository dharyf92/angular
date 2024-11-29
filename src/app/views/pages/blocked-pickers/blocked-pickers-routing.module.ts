import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BlockedPickersPage } from './blocked-pickers.page';

const routes: Routes = [
  {
    path: '',
    component: BlockedPickersPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BlockedPickersPageRoutingModule {}
