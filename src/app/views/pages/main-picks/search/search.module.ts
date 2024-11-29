import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AvatarComponent } from '@shared/components/avatar/avatar.component';
import { ListPickerModule } from '@shared/components/list-picker/list-picker.module';
import { ContrastDirective } from '@shared/directives/contrast.directive';
import { SearchPostListItemComponent } from './search-post-list-item/search-post-list-item.component';
import { SearchComponent } from './search.component';

@NgModule({
  declarations: [SearchComponent, SearchPostListItemComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule,
    ContrastDirective,
    AvatarComponent,
    ListPickerModule,
  ],
  exports: [SearchComponent],
})
export class SearchModule {}
