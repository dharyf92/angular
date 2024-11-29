import { Component } from '@angular/core';
import { ModalController, RangeCustomEvent } from '@ionic/angular';
import { ApiService } from '@shared/services/api/api.service';
import { PostsService } from '@shared/services/posts/posts.service';

@Component({
  selector: 'app-locations',
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.scss'],
})
export class LocationsComponent {
  locations: any;
  name = '';
  constructor(
    private apiService: ApiService,
    private modalController: ModalController,
    private postsService: PostsService
  ) {}

  search(ev: Event) {
    let data = (ev as RangeCustomEvent).detail.value;

    this.postsService.getCountries(data).subscribe(
      (res) => {
        this.locations = res.features;
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

  closeModal(item) {
    this.modalController.dismiss({ theme: item }, 'done');
  }
  closeModalWithoutThem() {
    this.modalController.dismiss({}, 'cancel');
  }
}
