import { Component, OnInit } from '@angular/core';
import { SavedItem } from '@core/models/post.model';
import { ModalController } from '@ionic/angular';
import { ApiService } from '@shared/services/api/api.service';
import { PostsService } from '@shared/services/posts/posts.service';
import { SavedDetailsComponent } from '../saved-details/saved-details.component';

@Component({
  selector: 'app-saved',
  templateUrl: './saved.component.html',
  styleUrls: ['./saved.component.scss'],
})
export class SavedComponent implements OnInit {
  halfWidth = 0;
  data: SavedItem[];
  constructor(
    private apiService: ApiService,
    private postsService: PostsService,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.halfWidth = window.screen.width / 2;
    this.postsService.savedCategories().subscribe(
      (res) => {
        if (res && res.length) {
          this.data = res;
        }
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
  closeModalWithoutThem() {
    this.modalController.dismiss({}, 'cancel');
  }

  async getSaveddetails(data: SavedItem) {
    const modal = await this.modalController.create({
      component: SavedDetailsComponent,
      componentProps: {
        data,
      },
    });
    modal.onDidDismiss().then((result) => {
      if (result.role !== 'cancel') {
        this.modalController.dismiss({ item: result.data.item });
      }
    });
    await modal.present();
  }
}
