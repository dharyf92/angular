import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthActions } from '@core/stores/auth/auth.actions';
import { AuthSelectors } from '@core/stores/auth/auth.selectors';
import { ModalController } from '@ionic/angular';
import { Store } from '@ngxs/store';
import { TelInputComponent } from '@shared/components/tel-input/tel-input.component';
import { ApiService } from '@shared/services/api/api.service';
import { AuthService } from '@shared/services/auth/auth.service';
import { CompletionService } from '@shared/services/completion/completion.service';
import { FirebaseAuthenticationService } from '@shared/services/firebase-authentication/firebase-authentication.service';

@Component({
  selector: 'app-verify-phone-number',
  templateUrl: './verify-phone-number.component.html',
  styleUrls: ['./verify-phone-number.component.scss'],
})
export class VerifyPhoneNumberComponent {
  private store = inject(Store);

  user = this.store.selectSignal(AuthSelectors.getUser);
  phoneNumber: any;
  dial = '+212';
  countries = [];
  constructor(
    private readonly firebaseAuthenticationService: FirebaseAuthenticationService,
    private router: Router,
    private modalController: ModalController,
    private authService: AuthService,
    private completionService: CompletionService,
    private apiService: ApiService
  ) {}

  public async verifyPhoneNumber(): Promise<void> {
    let data = { phone_number: this.dial + this.phoneNumber };
    try {
      // const phoneNumber = await this.showInputPhoneNumberAlert();
      if (!this.phoneNumber) {
        return;
      }
      this.apiService.showLoading('Loading...');
      await this.firebaseAuthenticationService.signInWithPhoneNumber({
        phoneNumber: data.phone_number,
      });
      if (!this.firebaseAuthenticationService.getRedirectResult()) {
        this.apiService.dismissLoading();
      }
    } finally {
      this.apiService.dismissLoading();
    }
  }
  goBack() {
    this.store
      .dispatch(AuthActions.Logout)
      .subscribe(() => this.router.navigate(['/sign-up']));
  }
  skipPhoneConfirmation() {
    // if the user is new redirect complete profile
    if (this.user().is_new) {
      this.router.navigate(['/welcome-to-one-pick']);
    } else {
      this.router.navigate(['/main-tabs']);
    }
  }

  async choiceCounty() {
    const modal = await this.modalController.create({
      component: TelInputComponent,
    });
    modal.onDidDismiss().then((result) => {
      if (result.role !== 'cancel') {
        this.dial = result.data.dial;
      }
    });
    await modal.present();
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
    let fdata = new FormData();

    let data = { phone_number: this.dial + this.phoneNumber };
    fdata.append('data', JSON.stringify(data));

    this.completionService.complete(fdata).subscribe(
      (res) => {
        this.verifyPhoneNumber();
        this.router.navigate(['/sign-up/verify-phone-number-code'], {
          state: { phoneNumber: data.phone_number },
        });
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

  addPhoneInfo(ev: any) {
    this.dial = ev.dial;
    this.phoneNumber = ev.phone;
  }
}
