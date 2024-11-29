import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainAccountPage } from './main-account.page';
import { DataStudioComponent } from './data-studio/data-studio.component';
import { NavParams } from '@ionic/angular';
import { EditProfileComponent } from './edit-profile/edit-profile.component';


const routes: Routes = [
  {
    path: '',
    component: MainAccountPage
  },
  {
    path: 'data-studio',
    component: DataStudioComponent
  },
  {
    path: 'profil-edit',
    component: EditProfileComponent
  },

  
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [NavParams]
})
export class MainAccountPageRoutingModule {}
