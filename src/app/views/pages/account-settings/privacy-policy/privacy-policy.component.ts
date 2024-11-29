import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { ApiService } from '@shared/services/api/api.service';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss'],
})
export class PrivacyPolicyComponent implements OnInit {
  constructor(
    private modalController: ModalController,
    private router: Router,
    private apiService: ApiService
  ) {}

  ngOnInit() {}

  goBack() {
    this.router.navigate(['/main-tabs/account-settings']);
  }

  ionViewWillEnter() {
    this.apiService.visibleTabs = false;
  }

  ionViewWillLeave() {
    this.apiService.visibleTabs = true;
  }
}
