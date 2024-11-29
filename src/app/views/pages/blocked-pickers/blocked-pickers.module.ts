import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BlockedPickersPageRoutingModule } from './blocked-pickers-routing.module';

import { BlockedPickersPage } from './blocked-pickers.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BlockedPickersPageRoutingModule
  ],
  declarations: [BlockedPickersPage]
})
export class BlockedPickersPageModule {}
