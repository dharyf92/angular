import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from '@shared/modules/shared-module/SharedModule.module';
import { SuggestionModule } from '../suggestion/suggestion.module';
import { OnePostComponent } from './one-post.component';
import { SuggestionListModule } from '@shared/components/suggestion-list/suggestion-list.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    SharedModule,
    SuggestionModule,
    SuggestionListModule,
  ],
  exports: [OnePostComponent],
  declarations: [OnePostComponent],
})
export class OnePostModule {}
