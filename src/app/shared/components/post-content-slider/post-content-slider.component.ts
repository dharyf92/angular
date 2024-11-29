import {
  Component,
  computed,
  effect,
  ElementRef,
  input,
  output,
  viewChild,
} from '@angular/core';
import { Content } from '@core/models/content.model';
import { SwiperOptions } from 'swiper/types';

@Component({
  selector: 'app-post-content-slider',
  templateUrl: './post-content-slider.component.html',
  styleUrls: ['./post-content-slider.component.scss'],
})
export class PostContentSliderComponent {
  contents = input.required<Content[]>();
  index = input<number>(0);

  changeIndex = output<number>();

  length = computed(() => this.contents().length);

  slideOptions = computed(
    () =>
      ({
        slidesPerView: this.length() > 1 ? 1.1 : 1,
        spaceBetween: this.length() > 1 ? 16 : 0,
        threshold: 2,
        observer: true,
        observeParents: true,
        observeSlideChildren: true,
      } satisfies SwiperOptions)
  );

  swiperContainer = viewChild<ElementRef>('mySwiper');

  type = computed(() => {
    if (this.contents().some((content) => content.question_text)) {
      return 'questions';
    } else if (
      this.contents().some(
        (content) => content.image_path.url || content.video_path
      )
    ) {
      return 'media';
    } else {
      return 'saved';
    }
  });

  constructor() {
    effect(() => {
      if (this.swiperContainer()) {
        this.initSwiper();
      }
    });
  }

  private initSwiper() {
    const swiperEl = this.swiperContainer().nativeElement;
    Object.assign(swiperEl, { ...this.slideOptions() });
    swiperEl.initialize();
  }

  onSlideChanged(event: any) {
    this.changeIndex.emit(event.detail[0].activeIndex);
  }
}
