import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '@shared/services/api/api.service';
import { AuthService } from '@shared/services/auth/auth.service';

@Component({
  selector: 'app-create-new-password',
  templateUrl: './create-new-password.page.html',
  styleUrls: ['./create-new-password.page.scss'],
})
export class CreateNewPasswordPage implements OnInit {
  password;
  confirmpassword;
  constructor(
    private router: Router,
    private apiService: ApiService,
    private authService: AuthService
  ) {}

  ionViewDidEnter() {
    if (!this.authService.token) {
      this.router.navigate(['reset-password']);
    }
  }
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

    this.authService
      .resetPassword({ token: this.authService.token, password: this.password })
      .subscribe(
        (res: any) => {
          this.router.navigate(['success-new-password']);
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
}
