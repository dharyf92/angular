import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthActions } from '@core/stores/auth/auth.actions';
import { AuthSelectors } from '@core/stores/auth/auth.selectors';
import { ModalController } from '@ionic/angular';
import { Store } from '@ngxs/store';
import { TelInputComponent } from '@shared/components/tel-input/tel-input.component';
import { ApiService } from '@shared/services/api/api.service';
import { CompletionService } from '@shared/services/completion/completion.service';

@Component({
  selector: 'app-change-phone',
  templateUrl: './change-phone.component.html',
  styleUrls: ['./change-phone.component.scss'],
})
export class ChangePhoneComponent implements OnInit {
  phoneNumber: any;
  dial = '+212';
  countries = [];
  user;
  constructor(
    private apiService: ApiService,
    private readonly store: Store,
    private readonly router: Router,
    private completionService: CompletionService,
    private readonly modalController: ModalController
  ) {}

  ngOnInit() {
    this.user = this.store.selectSnapshot(AuthSelectors.getUser);
    if (this.user.phone_number) {
      this.phoneNumber = this.user.phone_number.national_number;
    }
    if (this.user?.phone_number?.country_code) {
      this.dial = '+' + this.user.phone_number.country_code;
    }
  }

  goToPhoneConfirmation() {
    if (!this.phoneNumber) {
      this.apiService.displayMessage(
        'Please fill the required inputs.',
        'danger',
        'warning-outline'
      );
      return;
    }

    if (!this.dial) {
      this.apiService.displayMessage(
        'Please select the dial.',
        'danger',
        'warning-outline'
      );
      return;
    }
    console.log(this.dial);
    let fdata = new FormData();

    let data = { phone_number: this.dial + this.phoneNumber };
    console.log(data);
    fdata.append('data', JSON.stringify(data));
    this.completionService.complete(fdata).subscribe(
      (res) => {
        this.store.dispatch(new AuthActions.SaveUser(res));
        this.apiService.displayMessage(
          'Phone number updated successfully.',
          'light',
          'checkmark-circle-outline'
        );
        this.goBack();
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

  addPhoneInfo(ev) {
    this.dial = ev.dial;
    this.phoneNumber = ev.phone;
  }

  goBack() {
    this.router.navigate(['/main-tabs/account-settings/manage_account']);
  }

  async choiceCounty() {
    // console.log(this.themes)
    const modal = await this.modalController.create({
      component: TelInputComponent,
      // Optional: Pass data to the modal
      componentProps: {
        countries: this.countries,
      },
    });
    modal.onDidDismiss().then((result) => {
      console.log(result);
      if (result.role === 'cancel') {
      } else {
        this.dial = result.data.dial;
      }
    });
    await modal.present();
  }

  ionViewWillEnter() {
    this.apiService.visibleTabs = false;
  }

  ionViewWillLeave() {
    this.apiService.visibleTabs = true;
  }
}
