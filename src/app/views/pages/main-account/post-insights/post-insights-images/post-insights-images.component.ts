import {
  AfterViewInit,
  Component,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { Content } from '@core/models/content.model';
import { AppService } from '@shared/services/app/app.service';

@Component({
  selector: 'app-post-insights-images',
  templateUrl: './post-insights-images.component.html',
  styleUrls: ['./post-insights-images.component.scss'],
})
export class PostInsightsImagesComponent {
  private readonly appService = inject(AppService);

  contents = input.required<Content[]>();
  index = input.required<number>();

  changeIndex = output<number>();

  type = computed(() => this.appService.identifyPostType(this.contents()));

  onChangeIndex = (idx: number) => {
    this.changeIndex.emit(idx);
  };
}
