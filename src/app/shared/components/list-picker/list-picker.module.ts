import { NgClass } from '@angular/common';
import { NgModule } from '@angular/core';
import { AvatarComponent } from '../avatar/avatar.component';
import { ListPickerItemComponent } from './list-picker-item/list-picker-item.component';
import { ListPickerComponent } from './list-picker.component';

@NgModule({
  declarations: [ListPickerComponent, ListPickerItemComponent],
  exports: [ListPickerComponent],
  imports: [AvatarComponent, NgClass ],
})
export class ListPickerModule {}
