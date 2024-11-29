import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-welcome-to-one-pick',
  templateUrl: './welcome-to-one-pick.page.html',
  styleUrls: ['./welcome-to-one-pick.page.scss'],
})
export class WelcomeToOnePickPage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  goToCompleteProfile() {
    this.router.navigate(['complete-profile'])
    // this.router.navigate(['verify-phone-number']);
  }

}
