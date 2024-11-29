import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { ContrastDirective } from '@shared/directives/contrast.directive';
import { SharedModule } from '@shared/modules/shared-module/SharedModule.module';
import { AccountPostItemComponent } from './account-post-item/account-post-item.component';
import { AccountPostsComponent } from './account-posts.component';

@NgModule({
  declarations: [AccountPostsComponent, AccountPostItemComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule,
    SharedModule,
    ContrastDirective,
  ],
  exports: [AccountPostsComponent],
})
export class AccountPostsModule {}
