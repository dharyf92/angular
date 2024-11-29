import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthActions } from '@core/stores/auth/auth.actions';
import { AuthSelectors } from '@core/stores/auth/auth.selectors';
import { ModalController, Platform } from '@ionic/angular';
import { SavedComponent } from '@modals/saved/saved.component';
import { Store } from '@ngxs/store';
import { ApiService } from '@shared/services/api/api.service';
import { AppService } from '@shared/services/app/app.service';
import { CompletionService } from '@shared/services/completion/completion.service';
import { FcmService } from '@shared/services/fcm/fcm.service';

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.page.html',
  styleUrls: ['./account-settings.page.scss'],
})
export class AccountSettingsPage {
  private readonly store = inject(Store);

  user = this.store.selectSignal(AuthSelectors.getUser);

  constructor(
    private fcm: FcmService,
    private router: Router,
    private modalController: ModalController,
    private completionService: CompletionService,
    private platform: Platform,
    private apiService: ApiService,
    private appService: AppService
  ) {}

  async openManagePickerAccount() {
    this.router.navigate(['/main-tabs/account-settings/manage_account']);
  }

  async openConditionandTerm() {
    this.router.navigate(['/main-tabs/account-settings/terms-conditions']);
  }

  async openPrivacyPolicy() {
    this.router.navigate(['/main-tabs/account-settings/privacy-policy']);
  }

  async openSwitchAccountType() {
    this.router.navigate(['/main-tabs/account-settings/switch-account']);
  }

  async openLanguageChoice() {
    this.router.navigate(['/main-tabs/account-settings/change-language']);
  }

  async openContactUs() {
    this.router.navigate(['/main-tabs/account-settings/contact-us']);
  }

  async openBlockedPickers() {
    this.router.navigate(['/main-tabs/account-settings/blocked-users']);
  }

  async openAccountInterests() {
    this.router.navigate(['/main-tabs/account-settings/change-interests']);
  }

  disconnect() {
    this.fcm.removeFcmToken();
    this.appService.signOut();
  }

  async getSavedThemes() {
    const modal = await this.modalController.create({
      component: SavedComponent,
    });
    modal.onDidDismiss().then((result) => {});
    await modal.present();
  }

  toogelPrivate() {
    let fdata = new FormData();
    let data = { is_private: this.user().is_private };
    fdata.append('data', JSON.stringify(data));
    this.completionService.complete(fdata).subscribe(
      (res) => {
        this.store.dispatch(new AuthActions.SaveUser(res));
        this.apiService.displayMessage(
          'Account updated successfully.',
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

  goBack() {
    this.router.navigate(['/main-tabs/main-account']);
  }

  toogelNotification() {
    console.log(this.user().is_notification_allowed);
    if (this.user().is_notification_allowed == true) {
      this.platform
        .ready()
        .then(() => {
          this.fcm.initPush();
        })
        .catch((e) => {
          console.log('error fcm: ', e);
        });
    }

    let fdata = new FormData();
    let data = { is_notification_allowed: this.user().is_notification_allowed };
    fdata.append('data', JSON.stringify(data));
    this.completionService.complete(fdata).subscribe(
      (res) => {
        this.store.dispatch(new AuthActions.SaveUser(res));
        this.apiService.displayMessage(
          'Notification updated successfully.',
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
    // this.user().is_private = !this.user().is_private
  }

  ionViewWillEnter() {
    this.apiService.visibleTabs = false;
  }

  ionViewWillLeave() {
    this.apiService.visibleTabs = true;
  }
}
