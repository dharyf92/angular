import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthSelectors } from '@core/stores/auth/auth.selectors';
import { Store } from '@ngxs/store';
import { ApiService } from '@shared/services/api/api.service';
import { CompletionService } from '@shared/services/completion/completion.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent implements OnInit {
  private readonly store = inject(Store);
  password;
  confirmpassword;

  user = this.store.selectSignal(AuthSelectors.getUser);

  constructor(
    private router: Router,
    private apiService: ApiService,
    private profileService: CompletionService
  ) {}

  ngOnInit() {}

  goToSuccessPassword() {
    if (this.password != this.confirmpassword) {
      this.apiService.displayMessage(
        'Passwords do not match',
        'danger',
        'warning-outline'
      );
      return;
    }

    this.profileService
      .updateProfile({
        id: this.user().id,
        password: this.password,
      })
      .subscribe(
        (res: any) => {
          this.apiService.displayMessage(
            'Password updated successfully.',
            'light',
            'checkmark-circle-outline'
          );
          this.router.navigate(['/main-tabs/account-settings/manage_account']);
        },
        (error) => {
          console.log(error);
          this.apiService.displayMessage(
            error.error.detail,
            'danger',
            'warning-outline'
          );
        }
      );
  }
  goBack() {
    this.router.navigate(['/main-tabs/account-settings/manage_account']);
  }
}
