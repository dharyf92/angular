import { Component, OnInit, Renderer2, signal } from '@angular/core';
import { Category } from '@core/models/post.model';
import { ModalController, RangeCustomEvent } from '@ionic/angular';
import { ApiService } from '@shared/services/api/api.service';
import { FilterData, PostsService } from '@shared/services/posts/posts.service';
import { FilterOverviewComponent } from '@views/modals/filter-overview/filter-overview.component';
import { LocationsComponent } from '@views/modals/locations/locations.component';
import { sift } from 'radash';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
})
export class FilterComponent implements OnInit {
  progress = 0;
  address = signal('');
  lastEmittedValue: any;
  themes: Category[];
  value = 0;
  selectedThemeId = signal<string | null>(null);

  constructor(
    private apiService: ApiService,
    private renderer: Renderer2,
    public postsService: PostsService,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.getThemes();
  }
  pinFormatter(value: number) {
    this.progress = value;
    return `${value}%`;
  }
  onIonChange(ev: Event) {
    this.lastEmittedValue = (ev as RangeCustomEvent).detail.value;
  }
  customFormatter(value: number) {
    const range = document.querySelector('ion-range');
    if (value >= 0 && value <= 25) {
      const ionRangePin = document.querySelector('ion-range::part(pin)');
      console.log(ionRangePin);
      if (ionRangePin) {
        this.renderer.setStyle(ionRangePin, 'left', '0');
      }
      range.style.setProperty('--pin-color', '#05DD71');
      range.style.setProperty('--bar-background-active', '#05DD71');
      range.style.setProperty('--bar-background', '#05DD71');
      return 'Not urgent';
    } else if (value > 25 && value <= 50) {
      range.style.setProperty('--pin-color', '#F8D138');
      range.style.setProperty('--bar-background-active', '#F8D138');
      range.style.setProperty('--bar-background', '#F8D138');
      return 'Somewhat urgent';
    } else if (value > 50 && value <= 75) {
      range.style.setProperty('--pin-color', '#FF632B');
      range.style.setProperty('--bar-background-active', '#FF632B');
      range.style.setProperty('--bar-background', '#FF632B');
      return 'Somewhat urgent';
    } else if (value > 75 && value <= 100) {
      range.style.setProperty('--pin-color', '#FA2243');
      range.style.setProperty('--bar-background-active', '#FA2243');
      range.style.setProperty('--bar-background', '#FA2243');
      return 'Urgent';
    } else {
      range.style.setProperty('--pin-color', '#05DD71');
      range.style.setProperty('--bar-background-active', '#05DD71');
      range.style.setProperty('--bar-background', '#05DD71');
      return 'Not urgent'; // Default color if none of the conditions match
    }
  }
  getBackgroundColor() {
    if (this.lastEmittedValue >= 0 && this.lastEmittedValue <= 25) {
      return '#05DD71';
    } else if (this.lastEmittedValue > 25 && this.lastEmittedValue <= 50) {
      return '#F8D138';
    } else if (this.lastEmittedValue > 50 && this.lastEmittedValue <= 75) {
      return '#FF632B';
    } else if (this.lastEmittedValue > 75 && this.lastEmittedValue <= 100) {
      return '#FA2243';
    } else {
      return '#05DD71'; // Default color if none of the conditions match
    }
  }

  getThemes() {
    this.postsService.getThemes().subscribe(
      async (res) => {
        this.themes = res;
        console.log(res);
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

  async choiceLocation() {
    const modal = await this.modalController.create({
      component: LocationsComponent,
    });
    modal.onDidDismiss().then((result) => {
      if (result.role === 'cancel') {
        this.address.set('');
      } else {
        console.log(result.data.theme);
        this.address.set(result.data.theme.text);
      }
    });
    await modal.present();
  }

  toggleSelection(item: Category) {
    if (this.selectedThemeId()) {
      this.selectedThemeId.set(null);
      return;
    }
    this.selectedThemeId.set(item.id);
  }

  closeModalWithoutThem() {
    this.modalController.dismiss({}, 'cancel');
  }

  ionViewWillEnter() {
    const range = document.querySelector('ion-range');
    range.style.setProperty('--knob-border-radius', '5px');
  }

  search() {
    const filterParams = {
      categories: sift([this.selectedThemeId()]),
      dateCase: this.getDateCase(this.lastEmittedValue),
      address: this.address(),
    };

    this.postsService.filter(filterParams).subscribe({
      next: async (posts) => {
        const modal = await this.modalController.create({
          component: FilterOverviewComponent,
          componentProps: {
            posts,
          },
        });

        await modal.present();
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

  private getDateCase(value: number): FilterData['dateCase'] {
    let dateCase: FilterData['dateCase'] = '';

    if (value >= 0 && value <= 25) {
      dateCase = 'A';
    } else if (value > 25 && value <= 50) {
      dateCase = 'B';
    } else if (value > 50 && value <= 75) {
      dateCase = 'C';
    } else if (value > 75 && value <= 100) {
      dateCase = 'D';
    }
    return dateCase;
  }
}
