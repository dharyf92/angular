import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { AvatarComponent } from '@shared/components/avatar/avatar.component';
import { NotificationItemComponent } from './notification-item/notification-item.component';
import { NotificationComponent } from './notification.component';

@NgModule({
  declarations: [NotificationComponent, NotificationItemComponent],
  imports: [IonicModule, CommonModule, AvatarComponent],
  exports: [NotificationComponent],
})
export class NotificationModule {}
