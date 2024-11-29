import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ApiService } from '@shared/services/api/api.service';
import { UserService } from '@shared/services/user/user.service';

@Component({
  selector: 'app-blocked-users',
  templateUrl: './blocked-users.component.html',
  styleUrls: ['./blocked-users.component.scss'],
})
export class BlockedUsersComponent implements OnInit {
  users;
  constructor(
    private router: Router,
    private apiService: ApiService,
    private userService: UserService,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.userService.getBlockedUsers().subscribe(
      async (res) => {
        this.users = res;
      },
      (erreur: any) => {
        this.apiService.displayMessage(
          erreur.error.error,
          'danger',
          'warning-outline'
        );
      }
    );
  }

  goBack() {
    this.router.navigate(['/main-tabs/account-settings']);
  }

  async presentactionSheet2(user) {
    const alert = await this.alertController.create({
      header: 'Confirm Unblock',
      message:
        'will now be able to see your picks, pick and suggest. They won’t be notified that you unblocked them',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            // Handle cancel action
          },
        },
        {
          text: 'Unblock',
          handler: () => {
            this.unblockUser(user);
            // Handle delete action
          },
        },
      ],
    });

    await alert.present();
  }

  unblockUser(user) {
    this.userService.unblockUser(user.id).subscribe(
      (res) => {
        this.users = this.users.filter((item) => item.id != user.id);
        this.apiService.displayMessage(
          'The user is unblocked successfully.',
          'light',
          'checkmark-circle-outline'
        );
      },
      (erreur: any) => {
        this.apiService.displayMessage(
          erreur.error.error,
          'danger',
          'warning-outline'
        );
      }
    );
  }

  ionViewWillEnter() {
    this.apiService.visibleTabs = false;
  }

  ionViewWillLeave() {
    this.apiService.visibleTabs = true;
  }
}
