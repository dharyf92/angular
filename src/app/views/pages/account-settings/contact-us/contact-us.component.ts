import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { ApiService } from '@shared/services/api/api.service';
import { UserService } from '@shared/services/user/user.service';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss'],
})
export class ContactUsComponent implements OnInit {
  reason;
  message = '';
  reasons;
  constructor(
    private modalController: ModalController,
    private router: Router,
    private apiService: ApiService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.userService.getReasons().subscribe((res) => {
      this.reasons = res;
      if (this.reasons) {
        this.reason = this.reasons[0].id;
      }
    });
  }

  goBack() {
    this.router.navigate(['/main-tabs/account-settings']);
  }
  ionViewWillEnter() {
    this.apiService.visibleTabs = false;
  }

  ionViewWillLeave() {
    this.apiService.visibleTabs = true;
  }

  contactUs() {
    if (!this.message || !this.reason) {
      this.apiService.displayMessage(
        'Please fill all fields',
        'danger',
        'warning-outline'
      );
      return;
    }
    let data = {
      reason_id: this.reason,
      message: this.message,
    };
    this.userService.contactUs(data).subscribe((res) => {
      this.apiService.displayMessage(
        'One of our specialists will contact you soon',
        'light',
        ''
      );
      this.goBack();
    });
  }
}
