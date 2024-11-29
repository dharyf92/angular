import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthActions } from '@core/stores/auth/auth.actions';
import { AuthSelectors } from '@core/stores/auth/auth.selectors';
import { Store } from '@ngxs/store';
import { ApiService } from '@shared/services/api/api.service';
import { CompletionService } from '@shared/services/completion/completion.service';

@Component({
  selector: 'app-switch-account-type',
  templateUrl: './switch-account-type.component.html',
  styleUrls: ['./switch-account-type.component.scss'],
})
export class SwitchAccountTypeComponent implements OnInit {
  private readonly store = inject(Store);

  selectedOption = 'personal';
  user = this.store.selectSignal(AuthSelectors.getUser);
  constructor(
    private apiService: ApiService,
    private completionService: CompletionService,
    private router: Router
  ) {}

  ngOnInit() {
    console.log(this.selectedOption);
    this.selected(this.user().account_type);
  }

  selected(value) {
    this.selectedOption = value;
    let personal_card = document.getElementById('personal-card');
    let personal_circle = document.getElementById('personal-circle');
    let business_card = document.getElementById('business-card');
    let business_circle = document.getElementById('business-circle');
    if (value == 'personal') {
      personal_card.classList.add('active');
      business_card.classList.add('inactive');
      business_card.classList.remove('active');
      personal_card.classList.remove('inactive');
      personal_circle.classList.add('circle-active');
      business_circle.classList.add('circle-inactive');
      business_circle.classList.remove('circle-active');
      personal_circle.classList.remove('circle-inactive');
    } else {
      business_card.classList.add('active');
      personal_card.classList.add('inactive');
      personal_card.classList.remove('active');
      business_card.classList.remove('inactive');
      business_circle.classList.add('circle-active');
      personal_circle.classList.add('circle-inactive');
      personal_circle.classList.remove('circle-active');
      business_circle.classList.remove('circle-inactive');
    }
    console.log('selected: ', this.selectedOption);
    console.log('value: ', value);
  }

  goBack() {
    this.router.navigate(['/main-tabs/account-settings']);
  }

  setAccoutType() {
    let fdata = new FormData();
    let data = { account_type: this.selectedOption };
    fdata.append('data', JSON.stringify(data));
    this.completionService.complete(fdata).subscribe(
      (res) => {
        this.store.dispatch(new AuthActions.SaveUser(res));
        this.apiService.displayMessage(
          'Your account has been updated successfully.',
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

  ionViewWillEnter() {
    this.apiService.visibleTabs = false;
  }

  ionViewWillLeave() {
    this.apiService.visibleTabs = true;
  }
}
