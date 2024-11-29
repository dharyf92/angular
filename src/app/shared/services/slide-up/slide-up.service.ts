import { inject, Injectable } from '@angular/core';
import { Post } from '@core/models/post.model';
import { ModalController } from '@ionic/angular';
import { SuggestionComponent } from '@views/modals/suggestion/suggestion.component';

@Injectable({
  providedIn: 'root',
})
export class SlideUpService {
  private modalController = inject(ModalController);

  async present(post: Post) {
    console.log({ post }, 'my test');

    const modal = await this.modalController.create({
      component: SuggestionComponent,
      componentProps: {
        post,
      },
    });
    await modal.present();
  }
}
