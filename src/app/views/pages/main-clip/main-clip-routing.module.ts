import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainClipPage } from './main-clip.page';

const routes: Routes = [
  {
    path: '',
    component: MainClipPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainClipPageRoutingModule {}
