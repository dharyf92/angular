import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListPickersPage } from './list-pickers.page';

const routes: Routes = [
  {
    path: '',
    component: ListPickersPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListPickersPageRoutingModule {}
