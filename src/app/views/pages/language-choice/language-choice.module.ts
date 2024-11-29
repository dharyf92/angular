import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LanguageChoicePageRoutingModule } from './language-choice-routing.module';

import { LanguageChoicePage } from './language-choice.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LanguageChoicePageRoutingModule
  ],
  declarations: [LanguageChoicePage]
})
export class LanguageChoicePageModule {}
