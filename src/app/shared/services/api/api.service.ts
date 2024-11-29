import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  loaderLoading = false;
  isToastPresent = false;
  visibleTabs = true;
  img = 0;
  selectedTab = 'main-picks';
  private loader: HTMLIonLoadingElement;

  constructor(
    private toastController: ToastController,
    private loadingCtrl: LoadingController,
    private router: Router
  ) {}

  async displayMessage(content: string, color: string, icon: string) {
    if (this.isToastPresent) {
      return;
    }
    this.isToastPresent = true;
    const toast = await this.toastController.create({
      message: content,
      duration: 4000,
      position: 'top',
      color: color, //danger, dark, light, warning, ...
      icon: color == 'danger' ? icon : 'checkmark-circle-outline',
      cssClass: color == 'danger' ? '' : 'greenToast',
    });
    toast.onDidDismiss().then(() => {
      this.isToastPresent = false;
    });
    await toast.present();
  }

  public showLoading(message: string, duration = 2000) {
    this.loaderLoading = true;
    this.loadingCtrl
      .create({
        message,
        showBackdrop: true,
        duration: duration,
      })
      .then((load) => {
        this.loader = load;
        load.present().then(() => {
          this.loaderLoading = false;
        });
      });
  }

  public dismissLoading() {
    this.loader?.dismiss().then(() => {
      this.loader = null;
    });
  }

  switchTab(
    tab: 'main-picks' | 'main-account' | 'main-clips' | 'main-discover'
  ) {
    this.selectedTab = tab;
    this.router.navigate(['/main-tabs/' + tab]);
  }
}
