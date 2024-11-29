import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '@shared/services/api/api.service';
import { AuthService } from '@shared/services/auth/auth.service';

@Component({
  selector: 'app-reset-password-code',
  templateUrl: './reset-password-code.page.html',
  styleUrls: ['./reset-password-code.page.scss'],
})
export class ResetPasswordCodePage implements OnInit {
  code;

  constructor(
    private router: Router,
    private authService: AuthService,
    private apiService: ApiService
  ) {}
  ngOnInit() {}
  ionViewDidEnter() {
    if (!this.authService.email) {
      this.router.navigate(['reset-password']);
    }
  }

  goToCreatePassword() {
    if (!this.code) {
      this.apiService.displayMessage(
        'Please provide a valid code.',
        'danger',
        'warning-outline'
      );
      return;
    }

    if (this.code.length != 8) {
      this.apiService.displayMessage(
        'The code must have 8 characters.',
        'danger',
        'key-outline'
      );
      return;
    }

    this.authService
      .verifyCode({ email: this.authService.email, code: this.code })
      .subscribe(
        (res: any) => {
          this.authService.token = res.detail;
          this.router.navigate(['create-new-password']);
        },
        (error) => {
          console.log(error);
          this.apiService.displayMessage(
            error.error.detail,
            'danger',
            'warning-outline'
          );
          // this.router.navigate(['create-new-password'])
        }
      );
  }
}
