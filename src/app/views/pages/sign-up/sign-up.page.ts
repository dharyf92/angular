import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  SignInWithApple,
  SignInWithAppleResponse,
} from '@capacitor-community/apple-sign-in';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { AuthActions } from '@core/stores/auth/auth.actions';
import { AuthSelectors } from '@core/stores/auth/auth.selectors';
import { isPlatform } from '@ionic/angular';
import { Store } from '@ngxs/store';
import { ApiService } from '@shared/services/api/api.service';
import { AuthService } from '@shared/services/auth/auth.service';
import { FirebaseAuthenticationService } from '@shared/services/firebase-authentication/firebase-authentication.service';
import { defer, tryit } from 'radash';
import { lastValueFrom, Subscription } from 'rxjs';
import { z } from 'zod';

const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export type UserCredentials = {
  email: string;
  password: string;
  username?: string;
};

export type GoogleUserData = {
  familyName: string;
  givenName: string;
  email: string;
  imageUrl: string;
};

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage {
  gUser: any;
  isSubmitted = false;
  toggelEye = true;
  signUpForm!: FormGroup;
  validationErrors: string[] = [];
  sub!: Subscription;
  constructor(
    private router: Router,
    private apiService: ApiService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private readonly firebaseAuthenticationService: FirebaseAuthenticationService,
    private readonly store: Store
  ) {
    this.firebaseAuthenticationService.getRedirectResult().then((result) => {
      if (result?.user) {
        console.log(result);
      }
    });
    if (!isPlatform('capacitor')) {
      GoogleAuth.initialize({
        grantOfflineAccess: false,
      });
    }
    this.signUpForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  async createAccount(email: string, password: string) {
    const safeParse = userSchema.safeParse({ email, password });

    if (!safeParse.success) {
      this.apiService.displayMessage(
        safeParse.error.errors[0].message,
        'danger',
        'warning-outline'
      );
      return;
    }

    await defer(async () => {
      // Todo: Check if the email exists or not
      const checkEmail = tryit(async (email: string) => {
        const emailSchema = z.string().email();
        const safeParse = emailSchema.safeParse(email);

        if (!safeParse.success) {
          throw new Error(safeParse.error.errors[0].message);
        }
        return lastValueFrom(this.authService.verifyEmail(email));
      });

      const [err, res] = await checkEmail(email);

      this.authService.userBuilder.setEmail(email).setPassword(password);

      if (res !== undefined) {
        const resultSchema = z.boolean();
        const safeParse = resultSchema.safeParse(res);

        if (safeParse.error) {
          this.apiService.displayMessage(
            safeParse.error.errors[0].message,
            'danger',
            'warning-outline'
          );
          return;
        }

        console.log(
          'User signed up:',
          safeParse.data,
          this.authService.userBuilder.build()
        );
        if (res === true) {
          this.apiService.displayMessage(
            'Your email address is already registered',
            'danger',
            'warning-outline'
          );
        } else this.router.navigate(['/complete-profile']);
      } else if (err) {
        // Handle error
        console.error('Sign-up error:', err);
        this.apiService.displayMessage(
          err.message,
          'danger',
          'warning-outline'
        );
      }
    });
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

  async aSignIn() {
    this.apiService.showLoading('Loading...');

    SignInWithApple.authorize({
      clientId: 'apple.com',
      redirectURI: 'https://www.yourfrontend.com/login',
      scopes: 'email name',
      state: '12345',
      //nonce: 'nonce',
    })
      .then((result: SignInWithAppleResponse) => {
        this.apiService.dismissLoading();
        console.log(result);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async signUp() {
    this.isSubmitted = true;
    this.validationErrors = [];

    if (this.signUpForm.invalid) {
      return;
    }
    const { email, password } = this.signUpForm.value;
    this.apiService.showLoading('Loading...', 0);

    await this.createAccount(email, password);
    this.apiService.dismissLoading();

    return;
  }

  goBack() {
    this.apiService.img = 4;
    this.router.navigate(['/home']);
  }
}
