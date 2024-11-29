import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { ApiService } from '@shared/services/api/api.service';

@Component({
  selector: 'app-manage-picker-account',
  templateUrl: './manage-picker-account.component.html',
  styleUrls: ['./manage-picker-account.component.scss'],
})
export class ManagePickerAccountComponent implements OnInit {
  constructor(
    private modalController: ModalController,
    private router: Router,
    private apiService: ApiService
  ) {}

  goback() {
    this.router.navigate(['main-tabs/account-settings']);
  }

  ngOnInit() {}

  changePhone() {
    this.router.navigate(['main-tabs/account-settings/change-phone']);
  }

  changeEmail() {
    this.router.navigate(['main-tabs/account-settings/change-email']);
  }

  changePassword() {
    this.router.navigate(['main-tabs/account-settings/change-password']);
  }

  ionViewWillEnter() {
    this.apiService.visibleTabs = false;
  }

  ionViewWillLeave() {
    this.apiService.visibleTabs = true;
  }
}
