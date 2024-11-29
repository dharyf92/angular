import { Component, input, output } from '@angular/core';
import { Notification } from '@models/notification.model';

@Component({
  selector: 'app-notification-item',
  templateUrl: './notification-item.component.html',
  styleUrls: ['./notification-item.component.scss'],
})
export class NotificationItemComponent {
  notification = input.required<Notification>();

  onProfileSelect = output<string>();

  onPostSelect = output<Notification>();

  onShowActionSheet = output<Notification>();

  onDeleteNotification = output<Notification>();

  // Méthodes pour émettre les événements
  selectProfile(userId: string): void {
    console.log('profile', userId);
    this.onProfileSelect.emit(userId);
  }

  selectPost(notification: Notification): void {
    this.onPostSelect.emit(notification);
  }

  showActionSheet(notification: Notification): void {
    this.onShowActionSheet.emit(notification);
  }

  deleteNotification(notification: Notification): void {
    this.onDeleteNotification.emit(notification);
  }
}
