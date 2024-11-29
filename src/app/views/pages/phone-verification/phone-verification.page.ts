import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-phone-verification',
  templateUrl: './phone-verification.page.html',
  styleUrls: ['./phone-verification.page.scss'],
})
export class PhoneVerificationPage implements OnInit {
  
  num1 = '2';
  num2 = '9';
  num3 = '7';
  num4 = '*';
  num5 = '*';
  constructor() { }

  ngOnInit() {
  }


  verify() {
    //Verify the code
  }

}


