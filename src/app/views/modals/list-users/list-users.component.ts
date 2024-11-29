import { Component, inject, input, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { ModalController } from '@ionic/angular';
import { Filter, PostsService } from '@shared/services/posts/posts.service';
import { merge, switchMap } from 'rxjs';

@Component({
  selector: 'app-list-users',
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.scss'],
})
export class ListUsersComponent {
  private readonly postsService = inject(PostsService);
  private readonly modalController = inject(ModalController);

  postId = input.required<string>();

  params = signal<Filter>({ skip: 0, limit: 20 });

  pickers = toSignal(
    merge(toObservable(this.postId), toObservable(this.params)).pipe(
      switchMap(() =>
        this.postsService.listPickers(this.postId(), this.params())
      )
    )
  );

  closeModalWithoutThem() {
    this.modalController.dismiss({}, 'cancel');
  }
}
