import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LanguageChoicePage } from './language-choice.page';

const routes: Routes = [
  {
    path: '',
    component: LanguageChoicePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LanguageChoicePageRoutingModule {}
