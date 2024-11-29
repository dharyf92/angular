import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainDiscoverPage } from './main-discover.page';
import { ShowpicksComponent } from './showpicks/showpicks.component';
import { ShowusersComponent } from './showusers/showusers.component';

const routes: Routes = [
  {
    path: '',
    component: MainDiscoverPage
  },
  {
    path: 'users',
    component: ShowusersComponent
  },
  {
    path: 'picks',
    component: ShowpicksComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainDiscoverPageRoutingModule {}
