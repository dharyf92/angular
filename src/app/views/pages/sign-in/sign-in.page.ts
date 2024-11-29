import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { AuthActions } from '@core/stores/auth/auth.actions';
import { AuthSelectors } from '@core/stores/auth/auth.selectors';
import { isPlatform } from '@ionic/angular';
import { Store } from '@ngxs/store';
import { ApiService } from '@shared/services/api/api.service';
import { AppService } from '@shared/services/app/app.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.page.html',
  styleUrls: ['./sign-in.page.scss'],
})
export class SignInPage {
  private readonly store = inject(Store);

  isSubmitted = false;
  signInForm!: FormGroup;
  toggelEye = true;
  sub!: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private readonly appService: AppService,
    private router: Router
  ) {
    this.appService.checkRegistered();

    if (!isPlatform('capacitor')) {
      GoogleAuth.initialize({
        grantOfflineAccess: false,
      });
    }
    this.signInForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  async LogIn() {
    this.isSubmitted = true;
    if (this.signInForm.invalid) {
      return;
    }
    this.apiService.showLoading('Loading...');

    this.store
      .dispatch(new AuthActions.Login(this.signInForm.value))
      .subscribe(() => {
        const isAuthenticated = this.store.selectSnapshot(
          AuthSelectors.getIsAuthenticated
        );
        console.log(isAuthenticated);
        if (isAuthenticated) {
          this.apiService.displayMessage(
            'You have successfully signed in',
            'light',
            'checkmark-circle-outline'
          );
          this.router.navigate(['/main-tabs/main-picks'], { replaceUrl: true });
        }
      });

    return;
  }

  async gSignIn() {
    this.apiService.showLoading('Loading...');

    this.store.dispatch(new AuthActions.GoogleLogin()).subscribe(() => {
      const isAuthenticated = this.store.selectSnapshot(
        AuthSelectors.getIsAuthenticated
      );

      this.apiService.dismissLoading();

      if (isAuthenticated) {
        this.router.navigate(['main-tabs']);
      } else {
        this.router.navigate(['complete-profile']);
      }
    });
  }

  goBack() {
    this.apiService.img = 4;
    this.router.navigate(['/home']);
  }

  goToForgotPassword() {
    this.router.navigate(['reset-password']);
  }
}
