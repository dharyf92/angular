import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-success-new-password',
  templateUrl: './success-new-password.page.html',
  styleUrls: ['./success-new-password.page.scss'],
})
export class SuccessNewPasswordPage implements OnInit {

  constructor(private router: Router,) { }

  ngOnInit() {
  }
  getStart(){
    this.router.navigate(['sign-in'])
  }

}
