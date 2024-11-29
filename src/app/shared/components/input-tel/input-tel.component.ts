import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { LoadingController, ModalController } from '@ionic/angular';
import { ApiService } from '@shared/services/api/api.service';
import { AuthService } from '@shared/services/auth/auth.service';
import { TelInputComponent } from '../tel-input/tel-input.component';

@Component({
  selector: 'app-input-tel',
  templateUrl: './input-tel.component.html',
  styleUrls: ['./input-tel.component.scss'],
})
export class InputTelComponent implements OnInit {
  // phoneNumber: any = '';

  countries = [];

  @Input() phoneNumber;
  @Input() dial;
  @Output() newPhoneInfoEvent = new EventEmitter<any>();

  constructor(
    private loadingController: LoadingController,
    private modalController: ModalController,
    private authService: AuthService,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.authService.getCounties().subscribe(
      (response: any) => {
        this.countries = [...response].sort((a: any, b: any) => {
          a = a.name.common.toLowerCase(); // or a.toLocaleLowerCase()
          b = b.name.common.toLowerCase(); // or b.toLocaleLowerCase()
          return a.localeCompare(b);
        });
      },
      (erreur: any) => {
        this.apiService.displayMessage(
          'Impossible de charger la liste des pays',
          'danger',
          'warning-outline'
        );
      }
    );
  }

  async choiceCounty() {
    const loading = await this.loadingController.create({
      message: 'Loading...', // You can customize the loading message
    });
    await loading.present();
    try {
      // console.log(this.themes)
      const modal = await this.modalController.create({
        component: TelInputComponent,
        // Optional: Pass data to the modal
        componentProps: {
          countries: this.countries,
        },
      });
      modal.onDidDismiss().then((result) => {
        console.log(result);
        if (result.role === 'cancel') {
        } else {
          this.dial = result.data.dial;
          const data = { dial: this.dial, phone: this.phoneNumber };
          this.newPhoneInfoEvent.emit(data);
          // this.sendData();
        }
      });
      await modal.present();
    } finally {
      // Dismiss the loading spinner once the modal is presented or if there's an error
      await loading.dismiss();
    }
  }

  sendData(event) {
    console.log(event);
    this.phoneNumber = event.detail.value || '';
    const data = { dial: this.dial, phone: this.phoneNumber };
    this.newPhoneInfoEvent.emit(data);
  }
}
