import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-themes',
  templateUrl: './themes.component.html',
  styleUrls: ['./themes.component.scss'],
})
export class ThemesComponent implements OnInit {
  @Input() themes: any;
  theme: any;

  constructor(private modalController: ModalController) {}

  ngOnInit() {}

  closeModal(item) {
    this.modalController.dismiss({ theme: item });
  }
  closeModalWithoutThem() {
    this.modalController.dismiss({}, 'cancel');
  }
}
