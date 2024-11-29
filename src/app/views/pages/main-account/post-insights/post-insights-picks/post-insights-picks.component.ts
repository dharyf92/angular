import { Component, inject, model, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { PostDataStudio } from '@core/models/post.model';
import { Filter, PostGateway } from '@core/ports/post.gateway';
import { ModalController } from '@ionic/angular';
import { merge, switchMap } from 'rxjs';
import { PostInsightsComponent } from '../post-insights.component';

@Component({
  selector: 'app-post-insights-picks',
  templateUrl: './post-insights-picks.component.html',
  styleUrls: ['./post-insights-picks.component.scss'],
})
export class PostInsightsPicksComponent {
  private readonly postGateway = inject(PostGateway);
  private readonly modalController = inject(ModalController);

  type = model.required<'ongoing' | 'closed'>();
  filter = signal<Filter>({ skip: 0, limit: 30 });

  posts = toSignal(
    merge(toObservable(this.filter), toObservable(this.type)).pipe(
      switchMap(() =>
        this.postGateway.stats({ ...this.filter(), type: this.type() })
      )
    )
  );

  onTypeChange(event: CustomEvent) {
    this.type.set(event.detail.value);
  }

  async showPostInsights(post: PostDataStudio) {
    const modal = await this.modalController.create({
      component: PostInsightsComponent,
      componentProps: { id: post.id },
    });
    await modal.present();
  }

  closeModal() {
    this.modalController.dismiss('cancel');
  }
}
