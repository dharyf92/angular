import { Component, inject, input } from '@angular/core';
import { Post } from '@core/models/post.model';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-filter-overview',
  templateUrl: './filter-overview.component.html',
  styleUrls: ['./filter-overview.component.scss'],
})
export class FilterOverviewComponent {
  private readonly modalController = inject(ModalController);

  posts = input.required<Post[]>();

  closeModalWithoutThem() {
    this.modalController.dismiss({}, 'cancel');
  }
}
