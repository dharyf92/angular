import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  inject,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';

import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { PostDataStudio } from '@core/models/post.model';
import { Filter, PostGateway } from '@core/ports/post.gateway';
import { ModalController } from '@ionic/angular';
import { Chart } from 'chart.js/auto';
import { merge, switchMap } from 'rxjs';
import { PostInsightsPicksComponent } from '../post-insights/post-insights-picks/post-insights-picks.component';
import { PostInsightsComponent } from '../post-insights/post-insights.component';

@Component({
  selector: 'app-data-studio',
  templateUrl: './data-studio.component.html',
  styleUrls: ['./data-studio.component.scss'],
})
export class DataStudioComponent implements OnInit, AfterViewInit {
  @ViewChild('barCanvas') private barCanvas: ElementRef;
  @ViewChild('doughnutCanvas') private doughnutCanvas: ElementRef;
  @ViewChild('doughnutAgeRange') private doughnutAgeRange: ElementRef;

  private readonly modalController = inject(ModalController);
  private readonly postGateway = inject(PostGateway);
  private readonly router = inject(Router);

  type = signal<'ongoing' | 'closed'>('ongoing');

  onTypeChange(event: CustomEvent) {
    this.type.set(event.detail.value);
  }

  filter = signal<Filter>({ skip: 0, limit: 3 });

  posts = toSignal(
    merge(toObservable(this.filter), toObservable(this.type)).pipe(
      switchMap(() =>
        this.postGateway.stats({ ...this.filter(), type: this.type() })
      )
    )
  );

  barChart: any;
  doughnutChart: any;
  lineChart: any;
  agedougnut: any;
  halfWidth = 0;
  constructor() {
    this.halfWidth = window.screen.width / 2;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.halfWidth = window.screen.width / 2;
  }

  ngOnInit() {
    console.log({ stats: this.posts() });
  }

  goBack() {
    this.router.navigate(['/main-tabs/main-account']);
  }

  async showPostInsights(post: PostDataStudio) {
    const modal = await this.modalController.create({
      component: PostInsightsComponent,
      componentProps: { id: post.id },
    });
    await modal.present();
  }

  async showPostList() {
    const modal = await this.modalController.create({
      component: PostInsightsPicksComponent,

      componentProps: { type: this.type() },
    });
    await modal.present();
  }

  ngAfterViewInit() {
    this.barChartMethod();
    this.doughnutChartMethod();
    // this.lineChartMethod();
    this.doughnutAgeRangeFunction();
  }

  barChartMethod() {
    // Now we need to supply a Chart element reference with an object that defines the type of chart we want to use, and the type of data we want to display.
    this.barChart = new Chart(this.barCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: ['BJP', 'INC', 'AAP', 'CPI', 'CPI-M', 'NCP'],
        datasets: [
          {
            label: '# of Votes',
            data: [10, 20, 30, 50, 80, 90],
            backgroundColor: [
              '#EBE6F8',
              '#D5CCF0',
              '#AE9DE2',
              '#866CD4',
              '#340FB7',
              '#340FB7',
            ],
            borderColor: [
              '#EBE6F8',
              '#D5CCF0',
              '#AE9DE2',
              '#866CD4',
              '#340FB7',
              '#340FB7',
            ],
            borderWidth: 1,
          },
        ],
      },
    });
  }

  doughnutChartMethod() {
    this.doughnutChart = new Chart(this.doughnutCanvas.nativeElement, {
      type: 'doughnut',
      data: {
        datasets: [
          {
            data: [60, 37, 2],
            backgroundColor: ['#3409B7', '#866CD4', '#D5CCF0'],
          },
        ],
      },
    });
  }

  doughnutAgeRangeFunction() {
    this.agedougnut = new Chart(this.doughnutAgeRange.nativeElement, {
      type: 'doughnut',
      data: {
        datasets: [
          {
            data: [60, 37, 2],
            backgroundColor: ['#3409B7', '#866CD4', '#D5CCF0'],
          },
        ],
      },
    });
  }
}
