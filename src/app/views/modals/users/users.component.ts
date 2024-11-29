import { Component, OnInit, signal } from '@angular/core';
import { Picker } from '@core/models/user.model';
import { ModalController } from '@ionic/angular';
import { ApiService } from '@shared/services/api/api.service';
import { UserService } from '@shared/services/user/user.service';
import { isEmpty } from 'radash';
import { debounceTime, Subject } from 'rxjs';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  users = signal<Picker[]>([]);

  searchInput = new Subject<string>();

  constructor(
    private apiService: ApiService,
    private modalController: ModalController,
    private userService: UserService
  ) {}

  ngOnDestroy(): void {
    this.searchInput.complete();
  }

  ngOnInit() {
    this.searchInput.pipe(debounceTime(400)).subscribe({
      next: (searchTerm) => {
        this.search(searchTerm);
      },
      error: (erreur: any) => {
        this.apiService.displayMessage(
          erreur.error.error,
          'danger',
          'warning-outline'
        );
      },
    });
  }

  search(query: string) {
    if (isEmpty(query)) return;

    this.userService.search(query).subscribe({
      next: (res) => {
        this.users.set(res);
      },
      error: (err: any) => {
        this.apiService.displayMessage(
          err.error.error,
          'danger',
          'warning-outline'
        );
      },
    });
  }

  onSearchInputChange(searchTerm: string) {
    this.searchInput.next(searchTerm);
  }

  chooseUser(item: Picker) {
    this.modalController.dismiss({ picker: item }, 'done');
  }
  closeModalWithoutThem() {
    this.modalController.dismiss({}, 'cancel');
  }
}
