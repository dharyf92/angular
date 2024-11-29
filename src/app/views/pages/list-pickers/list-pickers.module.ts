import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListPickersPageRoutingModule } from './list-pickers-routing.module';

import { ListPickersPage } from './list-pickers.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListPickersPageRoutingModule
  ],
  declarations: [ListPickersPage]
})
export class ListPickersPageModule {}
