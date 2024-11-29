import { Component, inject, input, output } from '@angular/core';
import { Picker } from '@core/models/user.model';
import { ApiService } from '@shared/services/api/api.service';
import { AppService } from '@shared/services/app/app.service';
import { UserService } from '@shared/services/user/user.service';

@Component({
  selector: 'app-list-picker',
  templateUrl: './list-picker.component.html',
  styleUrls: ['./list-picker.component.scss'],
})
export class ListPickerComponent {
  private appService = inject(AppService);
  private userService = inject(UserService);
  private apiService = inject(ApiService);

  pickers = input.required<Picker[]>();
  picked = output<void>();

  async showProfile(id: string) {
    this.appService.showProfile(id);
  }

  onPicked() {
    this.picked.emit();
  }

  togglePick(id: string) {
    this.userService.pickUser(id, 'accepted').subscribe({
      next: () => this.onPicked(),
      error: (err: any) => this.handleError(err),
    });
  }

  private handleError(err: any) {
    this.apiService.displayMessage(
      err.error?.error || 'Something went wrong. Please try again later',
      'danger',
      'warning-outline'
    );
  }
}
