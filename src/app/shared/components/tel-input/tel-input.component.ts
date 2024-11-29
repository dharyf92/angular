import { Component, OnInit } from '@angular/core';
import {
  InfiniteScrollCustomEvent,
  ModalController,
  NavParams,
} from '@ionic/angular';
import { ApiService } from '@shared/services/api/api.service';
import { AuthService } from '@shared/services/auth/auth.service';
@Component({
  selector: 'app-tel-input',
  templateUrl: './tel-input.component.html',
  styleUrls: ['./tel-input.component.scss'],
})
export class TelInputComponent implements OnInit {
  countries: any[] = [];
  countriespk: any[] = [];
  dataCountries: any[] = [];
  name;
  constructor(
    private apiService: ApiService,
    private navParams: NavParams,
    private authService: AuthService,
    private modalController: ModalController
  ) {
    this.dataCountries = JSON.parse(
      JSON.stringify(this.navParams.get('countries'))
    );
  }

  ngOnInit() {
    this.countries = JSON.parse(JSON.stringify(this.dataCountries));
    this.countriespk = JSON.parse(
      JSON.stringify(this.dataCountries.splice(0, 20))
    );
    // this.countriespk = JSON.parse(JSON.stringify(this.countriespk));
    // this.authService.getCounties().subscribe((response:any)=>{
    //   this.countries = response;
    //   this.countriespk = response;
    // }, (erreur:any)=>{
    //   this.apiService.displayMessage(erreur.error.error, "danger", "warning-outline")
    // })
  }
  closeModal() {
    this.modalController.dismiss();
  }

  search() {
    const searchTerm = this.name.toLowerCase();
    this.countriespk = this.countries.filter((country) => {
      return country.name.common.toLowerCase().includes(searchTerm);
    });
  }

  getDial(country) {
    this.modalController.dismiss({
      dial: country.idd.root + country.idd.suffixes[0],
    });
  }

  onIonInfinite(ev) {
    if (!this.name) {
      this.countriespk = JSON.parse(
        JSON.stringify([
          ...this.countriespk,
          ...this.countries.slice(
            this.countriespk.length,
            this.countriespk.length + 40
          ),
        ])
      );
      console.log(this.countriespk.length);
      setTimeout(() => {
        (ev as InfiniteScrollCustomEvent).target.complete();
      }, 1000);
    }
  }
}
