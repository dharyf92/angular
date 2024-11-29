import { Component, HostListener, input, OnInit } from '@angular/core';
import { Content } from '@core/models/content.model';
import { SavedItem } from '@core/models/post.model';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-saved-details',
  templateUrl: './saved-details.component.html',
  styleUrls: ['./saved-details.component.scss'],
})
export class SavedDetailsComponent implements OnInit {
  data = input.required<SavedItem>();
  halfWidth = 0;
  search_key = '';
  constructor(
    private navParams: NavParams,
    private modalController: ModalController
  ) {}
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.halfWidth = window.screen.width / 2;
  }
  ngOnInit() {
    this.halfWidth = window.screen.width / 2;
    console.log('Data received in saved details component', this.data());
  }

  displayCharacters(text) {
    if (text.length < 10) {
      return text;
    } else {
      return text.slice(0, 10) + '...';
    }
  }

  closeModal() {
    this.modalController.dismiss({}, 'cancel');
  }

  async openPost(item: Content) {
    this.modalController.dismiss({ item: item }, 'done');
  }
}
