import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MainClipsPage } from './main-clips.page';

const routes: Routes = [
  {
    path: '',
    component: MainClipsPage,
  },
  {
    path: ':id',
    loadChildren: () =>
      import('../main-clip/main-clip.module').then((m) => m.MainClipPageModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainClipsPageRoutingModule {}
