import {
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { PostGateway } from '@core/ports/post.gateway';
import { ModalController } from '@ionic/angular';
import { Chart } from 'chart.js';
import { alphabetical } from 'radash';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-post-insights',
  templateUrl: './post-insights.component.html',
  styleUrls: ['./post-insights.component.scss'],
})
export class PostInsightsComponent {
  private readonly modalController = inject(ModalController);
  private readonly postGateway = inject(PostGateway);

  private readonly doughnutCanvas =
    viewChild.required<ElementRef>('doughnutCanvas');
  private readonly doughnutAgeRange =
    viewChild.required<ElementRef>('doughnutAgeRange');
  id = input<string>();

  insights = toSignal(
    toObservable(this.id).pipe(
      switchMap(() => this.postGateway.getPostInsights(this.id()))
    )
  );

  gender = signal<'male' | 'female' | 'non_binary' | 'unknown'>('male');

  onGenderChange(event) {
    console.log(event);
    this.gender.set(event.detail.value);
  }

  activeIndex = signal<number>(0);

  // insights = signal<PostInsights>({
  //   id: '1',
  //   text_content:
  //     'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus.',
  //   post_contents: [
  //     {
  //       id: '1',
  //       question_text: null,
  //       question_color: null,
  //       post_id: '1',
  //       category_id: '1',
  //       created_by: '1',
  //       image_path: {
  //         url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
  //         width: 687,
  //         height: 1024,
  //       },
  //       video_path: null,
  //       picks_count: 13,
  //       thumbnail: {
  //         url: null,
  //         width: null,
  //         height: null,
  //       },
  //       score: 47,
  //       pick_status: false,
  //     },
  //     {
  //       id: '2',
  //       question_text: null,
  //       question_color: null,
  //       post_id: '1',
  //       category_id: '1',
  //       created_by: '1',
  //       image_path: {
  //         url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
  //         width: 687,
  //         height: 1024,
  //       },
  //       video_path: null,
  //       picks_count: 345,
  //       thumbnail: {
  //         url: null,
  //         width: null,
  //         height: null,
  //       },
  //       score: 20,
  //       pick_status: false,
  //     },
  //   ],
  //   pickers_age: {
  //     male: {
  //       age_13_17: 22,
  //       age_18_30: 23,
  //       age_31_45: 55,
  //       age_45_plus: 40,
  //     },
  //     female: {
  //       age_13_17: 22,
  //       age_18_30: 23,
  //       age_31_45: 55,
  //       age_45_plus: 40,
  //     },
  //     non_binary: {
  //       age_13_17: 22,
  //       age_18_30: 23,
  //       age_31_45: 55,
  //       age_45_plus: 40,
  //     },
  //     unknown: {
  //       age_13_17: 22,
  //       age_18_30: 23,
  //       age_31_45: 55,
  //       age_45_plus: 40,
  //     },
  //   },
  //   pickers_whereabouts: [
  //     {
  //       country: 'United States',
  //       count: 22,
  //       percentage: 0.22,
  //     },
  //   ],
  //   shares_count: 22,
  //   views_count: 125,
  //   suggestions_count: 97,
  //   pickers_gender: [{ name: 'Male', count: 22, percentage: 0.22 }],
  // });

  stats = computed(() => ({
    views: this.insights().views_count,
    shares: this.insights().shares_count,
    suggestions: this.insights().suggestions_count,
    picks: this.contents()[this.activeIndex()].picks_count,
  }));

  contents = computed(() =>
    alphabetical(
      this.insights().post_contents.filter((el) => !el.video_path),
      (c) => c.id
    )
  );

  selectedContent = computed(() => this.contents()[this.activeIndex()]);

  score = computed(() => this.selectedContent().score);

  pickers_gender = computed(() => {
    const genders = this.insights().pickers_gender;
    return Object.entries(genders).map(([key, value], index) => ({
      name: key,
      count: value.count,
      percentage: value.percentage,
      color: `hsl(255, 91%, ${30 + ((index * 15) % 90)}%)`,
    }));
  });

  pickers_age = computed(() => {
    const ageData = this.insights().pickers_age[this.gender()];
    const sortedAges = Object.entries(ageData);

    return sortedAges.map(([key, value], index) => ({
      name: key,
      value,
      color: `hsl(255, 91%, ${30 + ((index * 15) % 90)}%)`,
    }));
  });

  pickers_whereabouts = computed(() => {
    const whereabouts = this.insights().pickers_whereabouts;
    const sortedWhereabouts = whereabouts.sort((a, b) => b.count - a.count);

    return sortedWhereabouts.map((whereabout, index) => ({
      ...whereabout,
      // color: `hsl(255, 91%, ${30 + ((index * 15) % 90)}%)`,
    }));
  });

  constructor() {
    effect(() => {
      this.doughnutChartMethod();
      this.doughnutAgeRangeFunction();
      console.log(this.pickers_age());
    });
  }

  onSelect(index: number) {
    this.activeIndex.set(index);
  }

  closeModal() {
    this.modalController.dismiss('cancel');
  }

  doughnutChartMethod() {
    new Chart(this.doughnutCanvas().nativeElement, {
      type: 'doughnut',
      data: {
        datasets: [
          {
            data: this.pickers_gender().map((g) => g.percentage),
            backgroundColor: this.pickers_gender().map((g) => g.color),
          },
        ],
      },
    });
  }

  doughnutAgeRangeFunction() {
    new Chart(this.doughnutAgeRange().nativeElement, {
      type: 'doughnut',
      data: {
        datasets: [
          {
            data: this.pickers_age().map((el) => el.value),
            backgroundColor: this.pickers_age().map((el) => el.color),
          },
        ],
      },
    });
  }
}
