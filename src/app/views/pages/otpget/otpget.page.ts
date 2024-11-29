import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '@shared/services/api/api.service';
import { CompletionService } from '@shared/services/completion/completion.service';

@Component({
  selector: 'app-otpget',
  templateUrl: './otpget.page.html',
  styleUrls: ['./otpget.page.scss'],
})
export class OtpgetPage implements OnInit {
  selectedOption = '+212';
  phone = '';

  constructor(
    private router: Router,
    private completion: CompletionService,
    private apiService: ApiService
  ) {}

  ngOnInit() {}

  sendConfirmation() {
    //send The confirmation code to the phone number using the API
    let data = new FormData();
    let phoneNumber = { phone_number: this.selectedOption + this.phone };
    data.append('data', JSON.stringify(phoneNumber));
    this.completion.complete(data).subscribe(
      (result) => {
        this.router.navigate(['phone-verification']);
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
}
