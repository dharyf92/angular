import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '@shared/services/api/api.service';
import { AuthService } from '@shared/services/auth/auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage implements OnInit {
  email: string;
  resetPasswordForm!: FormGroup;
  isSubmitted = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private apiService: ApiService,
    private formBuilder: FormBuilder
  ) {
    this.resetPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  ngOnInit() {}

  goToResetPasswordCode() {
    this.isSubmitted = true;
    if (this.resetPasswordForm.invalid) {
      return;
    }

    this.apiService.showLoading('Loading...');
    const { email } = this.resetPasswordForm.value;

    this.authService.email = email;
    this.authService.passwordRecovery({ email: email }).subscribe(
      (res: any) => {
        this.apiService.dismissLoading();
        this.router.navigate(['reset-password-code']);
      },
      (error) => {
        this.apiService.dismissLoading();
        if (error.status === 404) {
          this.apiService.displayMessage(
            'Email Address Not Found',
            'danger',
            'warning-outline'
          );
        } else {
          this.apiService.displayMessage(
            error.error.detail,
            'danger',
            'warning-outline'
          );
        }
      }
    );
  }

  goBack() {
    this.router.navigate(['/sign-in']);
  }
}
