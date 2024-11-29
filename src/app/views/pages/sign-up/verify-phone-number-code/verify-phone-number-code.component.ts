import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '@shared/services/api/api.service';
import { FirebaseAuthenticationService } from '@shared/services/firebase-authentication/firebase-authentication.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-verify-phone-number-code',
  templateUrl: './verify-phone-number-code.component.html',
  styleUrls: ['./verify-phone-number-code.component.scss'],
})
export class VerifyPhoneNumberCodeComponent implements OnInit {
  verificationCode = new FormControl('');
  verificationId: string = '';
  phoneNumber: string;
  countdown: number = 0;
  timer: any;
  resendButtonDisabled: boolean = false;
  phoneVerificationCompletedSubscription!: Subscription;
  phoneVerificationFailedSubscription!: Subscription;
  isCodeComplete: boolean = false;

  constructor(
    private router: Router,
    private readonly firebaseAuthenticationService: FirebaseAuthenticationService,
    private apiService: ApiService
  ) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { phoneNumber: string };
    this.phoneNumber = state?.phoneNumber || '';
    // Subscribe to the phone code sent event
    this.firebaseAuthenticationService.phoneCodeSent$.subscribe(
      async (event) => {
        this.verificationId = event.verificationId;
      }
    );
  }

  ngOnInit() {
    this.setupVerificationListeners();
    this.startCountdown(2);
  }

  ngOnDestroy() {
    this.phoneVerificationCompletedSubscription.unsubscribe();
    this.phoneVerificationFailedSubscription.unsubscribe();
  }
  setupVerificationListeners() {
    this.phoneVerificationCompletedSubscription =
      this.firebaseAuthenticationService.phoneVerificationCompleted$.subscribe(
        () => this.onVerificationCompleted()
      );

    this.phoneVerificationFailedSubscription =
      this.firebaseAuthenticationService.phoneVerificationFailed$.subscribe(
        (error) => this.onVerificationFailed(error)
      );
  }
  onVerificationCompleted() {
    this.apiService.displayMessage(
      `Phone verification completed successfully`,
      'light',
      'checkmark-circle-outline'
    );
    this.router.navigate(['welcome-to-one-pick']);
  }

  onVerificationFailed(error: any) {
    this.apiService.displayMessage(
      `Phone verification failed${error}`,
      'danger',
      'warning-outline'
    );
    // Handle the failure (e.g., show error message to the user)
  }
  // Method to start the countdown
  startCountdown(minutes: number) {
    this.resendButtonDisabled = true;
    this.countdown = minutes * 60;
    this.timer = setInterval(() => {
      this.countdown--;
      if (this.countdown <= 0) {
        clearInterval(this.timer);
        this.resendButtonDisabled = false;
      }
    }, 1000);
  }
  get countdownDisplay(): string {
    const minutes = Math.floor(this.countdown / 60);
    const seconds = this.countdown % 60;
    return `${minutes}:${seconds}s`;
  }
  // Method to handle code input completion
  async onCodeCompleted(ev: any) {
    this.verificationCode.setValue(ev);
    this.isCodeComplete = true;
    if (this.verificationCode.valid) {
      await this.verifyCode();
    }
  }

  // Method to verify the OTP code
  async verifyCode() {
    try {
      this.apiService.showLoading('Verifying code...');
      if (this.verificationCode.value) {
        await this.firebaseAuthenticationService.confirmVerificationCode({
          verificationCode: this.verificationCode.value,
          verificationId: this.verificationId,
        });
        this.router.navigate(['welcome-to-one-pick']);
      }
    } catch (error) {
      this.apiService.displayMessage(
        'The verification code you entred is not valid',
        'danger',
        'warning-outline'
      );
    } finally {
      this.apiService.dismissLoading();
    }
  }

  // Method to initiate OTP code sending
  async sendCode() {
    try {
      this.apiService.showLoading('Sending code...');
      await this.firebaseAuthenticationService.signInWithPhoneNumber({
        phoneNumber: this.phoneNumber,
      });
      this.startCountdown(2); // Start countdown from 60 seconds
    } catch (error) {
      this.apiService.displayMessage(
        'Error sending code',
        'danger',
        'warning-outline'
      );
    } finally {
      this.apiService.dismissLoading();
    }
  }

  // Method to resend the OTP code
  async resendCode() {
    await this.sendCode();
  }

  goToWelcome() {
    this.verifyCode();
  }

  goBack() {
    this.router.navigate(['sign-up/verify-phone-number']);
  }

  onCodeChanged(ev: any) {
    this.isCodeComplete = false;
    console.log(ev);
  }
}
