import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InviteFriendsPageRoutingModule } from './invite-friends-routing.module';

import { FilterStringPipe } from '@shared/pipes/filter-string.pipe';
import { InviteFriendsPage } from './invite-friends.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InviteFriendsPageRoutingModule,
  ],
  declarations: [InviteFriendsPage, FilterStringPipe],
})
export class InviteFriendsPageModule {}
