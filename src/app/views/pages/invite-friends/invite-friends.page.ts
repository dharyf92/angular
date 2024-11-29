import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SmsManager } from '@byteowls/capacitor-sms';
import { Contacts } from '@capacitor-community/contacts';
import { Platform } from '@ionic/angular';
import { ApiService } from '@shared/services/api/api.service';

@Component({
  selector: 'app-invite-friends',
  templateUrl: './invite-friends.page.html',
  styleUrls: ['./invite-friends.page.scss'],
})
export class InviteFriendsPage implements OnInit {
  contacts = [];
  name = '';
  iosOrAndroid: boolean;
  selectedItem = '';
  constructor(
    private platform: Platform,
    private router: Router,
    private apiService: ApiService
  ) {}
  ngOnInit() {
    const projection = {
      // Specify which fields should be retrieved.
      name: true,
      phones: true,
      postalAddresses: true,
    };
    this.apiService.showLoading('Loading...');
    const result = Contacts.getContacts({
      projection,
    });
    result.then((res) => {
      console.log(res);
      this.contacts = res.contacts;
      this.apiService.dismissLoading();
    });

    this.iosOrAndroid = this.platform.is('android') || this.platform.is('ios');
  }

  sendSms() {
    let contactToSend = this.contacts
      .filter((item) => item.isChecked == true)
      .map((item) => item.phones[0].number + '');
    console.log(contactToSend);
    // const numbers: string[] = ["+212650946437", "+212774028965"];
    SmsManager.send({
      numbers: contactToSend,
      text: 'This is a example SMS',
    })
      .then(() => {
        this.router.navigate(['main-tabs']);
      })
      .catch((error) => {
        console.error(error);
      });
  }
}
