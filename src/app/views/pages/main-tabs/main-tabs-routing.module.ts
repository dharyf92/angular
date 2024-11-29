import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MainTabsPage } from './main-tabs.page';

const routes: Routes = [
  {
    path: '',
    component: MainTabsPage,
    children: [
      {
        path: 'main-picks',
        loadChildren: () =>
          import('../main-picks/main-picks.module').then(
            (m) => m.MainPicksPageModule
          ),
      },
      {
        path: 'main-discover',
        loadChildren: () =>
          import('../main-discover/main-discover.module').then(
            (m) => m.MainDiscoverPageModule
          ),
      },
      {
        path: 'main-clips',
        loadChildren: () =>
          import('../main-clips/main-clips.module').then(
            (m) => m.MainClipsPageModule
          ),
      },
      {
        path: 'main-account',
        loadChildren: () =>
          import('../main-account/main-account.module').then(
            (m) => m.MainAccountPageModule
          ),
      },
      {
        path: 'account-settings',
        loadChildren: () =>
          import('../account-settings/account-settings.module').then(
            (m) => m.AccountSettingsPageModule
          ),
      },
      {
        path: '',
        redirectTo: '/main-tabs/main-picks',
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainTabsPageRoutingModule {}
