import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.scss'],
})
export class ViewerComponent  implements OnInit {
  image;
  fullname;
  constructor(private modalController:ModalController, private navParams:NavParams) {
    this.image = this.navParams.get('image');
    this.fullname = this.navParams.get('fullname');
   }

  ngOnInit() {}

  closeModalWithoutThem() {
    this.modalController.dismiss({},'cancel');
  }

}
