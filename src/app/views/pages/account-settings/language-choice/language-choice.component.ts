import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { ApiService } from '@shared/services/api/api.service';

@Component({
  selector: 'app-language-choice',
  templateUrl: './language-choice.component.html',
  styleUrls: ['./language-choice.component.scss'],
})
export class LanguageChoiceComponent implements OnInit {
  constructor(
    private modalController: ModalController,
    private router: Router,
    private apiService: ApiService
  ) {}

  choice = 2;

  goback() {
    this.router.navigate(['/main-tabs/account-settings']);
  }

  choose(num) {
    this.choice = num;
  }

  finalChoice() {
    console.log('chose ', this.choice);
  }

  ionViewWillEnter() {
    this.apiService.visibleTabs = false;
  }

  ionViewWillLeave() {
    this.apiService.visibleTabs = true;
  }

  ngOnInit() {}
}
