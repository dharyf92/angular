import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AvatarComponent } from '@shared/components/avatar/avatar.component';
import { SuggestionListModule } from '@shared/components/suggestion-list/suggestion-list.module';
import { SharedModule } from '@shared/modules/shared-module/SharedModule.module';
import { SuggestionComponent } from './suggestion.component';

@NgModule({
  declarations: [SuggestionComponent],
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    AvatarComponent,
    SharedModule,
    SuggestionListModule,
  ],
  exports: [SuggestionComponent],
})
export class SuggestionModule {}
