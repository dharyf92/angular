import { Component, inject, input, model, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Profile } from '@core/models/user.model';
import { AuthSelectors } from '@core/stores/auth/auth.selectors';
import { ModalController, SegmentCustomEvent } from '@ionic/angular';
import { Store } from '@ngxs/store';
import { AppService } from '@shared/services/app/app.service';
import { Filter } from '@shared/services/posts/posts.service';
import { UserService } from '@shared/services/user/user.service';
import { merge, switchMap } from 'rxjs';

type Choice = 'pickers' | 'my-pickers';

@Component({
  selector: 'app-my-users',
  templateUrl: './my-users.component.html',
  styleUrls: ['./my-users.component.scss'],
})
export class MyUsersComponent {
  choice = model<Choice>('pickers');
  private readonly store = inject(Store);
  user = this.store.selectSignal(AuthSelectors.getUser);
  profile = input.required<Profile>();

  params = signal({ skip: 0, limit: 20 });

  pickers = toSignal(
    merge(toObservable(this.choice), toObservable(this.params)).pipe(
      switchMap(() =>
        this.getPickersList(this.profile().id, this.params(), this.choice())
      )
    )
  );

  refresh() {
    this.params.set({ ...this.params() });
  }

  changeSegment(event: SegmentCustomEvent) {
    this.choice.set(event.detail.value as Choice);
  }

  getPickersList(userId: string, params: Filter, choice: Choice) {
    if (choice === 'pickers') {
      return this.userService.getPickersList(userId, params);
    } else {
      return this.userService.getMyPickersList(userId, params);
    }
  }

  constructor(
    private userService: UserService,
    private readonly appService: AppService,
    private modalController: ModalController
  ) {}

  closeModalWithoutThem() {
    this.modalController.dismiss({}, 'cancel');
  }

  async showProfile(id: string) {
    this.appService.showProfile(id);
  }
}
