import { Component, inject, model } from '@angular/core';
import { Router } from '@angular/router';
import { AuthActions } from '@core/stores/auth/auth.actions';
import { AuthSelectors } from '@core/stores/auth/auth.selectors';
import { Store } from '@ngxs/store';
import { ApiService } from '@shared/services/api/api.service';
import { CompletionService } from '@shared/services/completion/completion.service';

@Component({
  selector: 'app-change-email',
  templateUrl: './change-email.component.html',
  styleUrls: ['./change-email.component.scss'],
})
export class ChangeEmailComponent {
  private readonly store = inject(Store);
  user = this.store.selectSignal(AuthSelectors.getUser);

  email = model(this.user().email);
  constructor(
    private apiService: ApiService,
    private router: Router,
    private completionService: CompletionService
  ) {}

  setEmail() {
    let fdata = new FormData();
    let data = { email: this.email() };
    fdata.append('data', JSON.stringify(data));
    this.completionService.complete(fdata).subscribe(
      (res) => {
        this.store.dispatch(new AuthActions.SaveUser(res));
        this.apiService.displayMessage(
          'Email Address updated successfully.',
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

  goBack() {
    this.router.navigate(['/main-tabs/account-settings/manage_account']);
  }

  ionViewWillEnter() {
    this.apiService.visibleTabs = false;
  }

  ionViewWillLeave() {
    this.apiService.visibleTabs = true;
  }
}
