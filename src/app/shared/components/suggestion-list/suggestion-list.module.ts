import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from '@shared/modules/shared-module/SharedModule.module';
import { SuggestionInputComponent } from './suggestion-input/suggestion-input.component';
import { SuggestionItemElementComponent } from './suggestion-item-element/suggestion-item-element.component';
import { SuggestionItemComponent } from './suggestion-item/suggestion-item.component';
import { SuggestionListComponent } from './suggestion-list.component';
import { SuggestionStatusBarComponent } from './suggestion-status-bar/suggestion-status-bar.component';

@NgModule({
  declarations: [
    SuggestionListComponent,
    SuggestionItemComponent,
    SuggestionItemElementComponent,
    SuggestionInputComponent,
    SuggestionStatusBarComponent,
  ],
  imports: [IonicModule, CommonModule, SharedModule, FormsModule],
  exports: [
    SuggestionListComponent,
    SuggestionItemComponent,
    SuggestionItemElementComponent,
    SuggestionInputComponent,
    SuggestionStatusBarComponent,
  ],
})
export class SuggestionListModule {}
