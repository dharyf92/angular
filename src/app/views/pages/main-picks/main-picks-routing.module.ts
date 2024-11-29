import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainPicksPage } from './main-picks.page';

const routes: Routes = [
  {
    path: '',
    component: MainPicksPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainPicksPageRoutingModule {}
