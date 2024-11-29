import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthActions } from '@core/stores/auth/auth.actions';
import { AuthSelectors } from '@core/stores/auth/auth.selectors';
import { ModalController, ToastController } from '@ionic/angular';
import { Store } from '@ngxs/store';
import { ApiService } from '@shared/services/api/api.service';
import { CompletionService } from '@shared/services/completion/completion.service';
import { TokenService } from '@shared/services/token/token.service';

@Component({
  selector: 'app-account-interests',
  templateUrl: './account-interests.component.html',
  styleUrls: ['./account-interests.component.scss'],
})
export class AccountInterestsComponent implements OnInit {
  private readonly store = inject(Store);

  user = this.store.selectSignal(AuthSelectors.getUser);
  interests: any = [];
  selection = 0;
  constructor(
    private router: Router,
    private apiService: ApiService,
    private tokenService: TokenService,
    private modalController: ModalController,
    private toastController: ToastController,
    private completionService: CompletionService
  ) {}

  ngOnInit() {
    this.getData();
  }

  goback() {
    this.router.navigate(['/main-tabs/account-settings']);
  }
  getData() {
    this.completionService.getInterests().subscribe(
      (res) => {
        this.interests = res;
        const idsArray = this.user().interests.map((item) => item.id);
        this.interests.map((item) => {
          item['isSelected'] = idsArray.includes(item.id) ? true : false;
          if (item['isSelected']) {
            this.selection++;
            item['pickOrder'] = this.selection;
          }
        });
        console.log(this.interests);
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
  reset() {
    const selectedInterests = this.interests.filter(
      (interest) => interest.isSelected
    );
    selectedInterests.forEach((interest, index) => {
      interest.pickOrder = index + 1;
    });
  }

  selectChip(interest) {
    if (interest.isSelected) {
      delete interest.pickOrder;
      this.selection -= 1;
      interest.isSelected = !interest.isSelected;
      this.reset();
    } else {
      if (this.selection > 3) {
        this.displayMessage(
          "You can't select more than 4 interests!",
          'danger',
          'danger'
        );
        return;
      }
      interest.isSelected = true;
      this.selection += 1;
      interest.pickOrder = this.selection;
    }
  }
  async displayMessage(content: string, color: string, icon: string) {
    const toast = await this.toastController.create({
      message: content,
      duration: 2000,
      position: 'top',
      color: color, //danger, dark, light, warning, ...
      icon: icon,
    });

    await toast.present();
  }
  done() {
    this.apiService.showLoading('Loading...');
    let array = this.interests
      .filter((item) => item.isSelected)
      .map((item) => item.id);
    let data = { interestsID: array };
    this.completionService.interset(data).subscribe(
      (res) => {
        this.store.dispatch(new AuthActions.SaveUser(res));
        this.apiService.dismissLoading();
        this.apiService.displayMessage(
          'Interests updated successfully.',
          'light',
          'checkmark-circle-outline'
        );
        this.goback();
      },
      (erreur: any) => {
        this.apiService.dismissLoading();
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
