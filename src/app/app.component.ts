import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Capacitor } from '@capacitor/core';
import { AuthSelectors } from '@core/stores/auth/auth.selectors';
import { ModalController, Platform } from '@ionic/angular';
import { Store } from '@ngxs/store';
import { AppService } from '@shared/services/app/app.service';
import { LanguageService } from '@shared/services/language/language.service';
import { SendIntent } from 'send-intent';
import { FirebaseAuthenticationService } from './shared/services/firebase-authentication/firebase-authentication.service';
import { ShareComponent } from './views/modals/share/share.component';
import { SuggestionComponent } from './views/modals/suggestion/suggestion.component';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  splashScreen = true;
  splashDone = false;
  public progress = 0;
  @ViewChild(SuggestionComponent) paneComponent: SuggestionComponent;

  constructor(
    private readonly firebaseAuthenticationService: FirebaseAuthenticationService,
    private readonly appService: AppService,
    private modalController: ModalController,
    private platform: Platform,
    private languageService: LanguageService,
    private readonly router: Router,
    private readonly store: Store
  ) {
    this.appService.setupListener();

    this.platform.ready().then(() => {
      this.languageService.setInitLang();
    });

    this.initializeApp();
  }

  async ngOnInit(): Promise<void> {
    const token = this.store.selectSnapshot(AuthSelectors.getIsAuthenticated);
    const user = await this.firebaseAuthenticationService.getCurrentUser();

    setInterval(() => {
      if (this.progress > 1.1) {
        this.splashScreen = false;
        return;
      } else if (this.progress >= 1) {
        this.splashDone = true;
      }
      this.progress += 0.1;
    }, 50);

    if (token && user) {
      if (Capacitor.getPlatform() !== 'web') {
        const result = await SendIntent.checkSendIntentReceived();
        console.log(result);
        if (result.url) {
          let resultUrl = decodeURIComponent(result.url);
          console.log(resultUrl);
          const sharedData = { data: result, isImg: false };
          await this.openSharePopUp(sharedData);
        }
      }
    }
  }

  ngOnDestroy() {
    this.appService.removeListener();
  }

  async openSharePopUp(data) {
    const modal = await this.modalController.create({
      component: ShareComponent,
      componentProps: {
        data: data,
      },
    });
    modal.onDidDismiss().then(() => {
      SendIntent.finish();
    });

    await modal.present();
  }
  private async initializeApp(): Promise<void> {
    await this.firebaseAuthenticationService.initialize();
    await this.appService.checkRegistered();
  }
}
