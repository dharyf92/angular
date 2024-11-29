import { Component, inject, input, output } from '@angular/core';
import { Picker } from '@core/models/user.model';
import { AuthSelectors } from '@core/stores/auth/auth.selectors';
import { Store } from '@ngxs/store';

@Component({
  selector: 'app-list-picker-item',
  templateUrl: './list-picker-item.component.html',
  styleUrls: ['./list-picker-item.component.scss'],
})
export class ListPickerItemComponent {
  private readonly store = inject(Store);

  picker = input.required<Picker>();

  profile = output<string>();
  pick = output<string>();

  user = this.store.selectSignal(AuthSelectors.getUser);

  onShowProfile() {
    this.profile.emit(this.picker().id);
  }

  onPick() {
    this.pick.emit(this.picker().id);
  }
}
