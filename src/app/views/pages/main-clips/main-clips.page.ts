import {
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  viewChild,
  ViewChild,
} from '@angular/core';
import { Post } from '@core/models/post.model';
import { AppService } from '@shared/services/app/app.service';
import { ClipsService } from '@shared/services/clips/clips.service';
import { SlideUpService } from '@shared/services/slide-up/slide-up.service';
import { register } from 'swiper/element';
register();

@Component({
  selector: 'app-main-clips',
  templateUrl: './main-clips.page.html',
  styleUrls: ['./main-clips.page.scss'],
})
export class MainClipsPage {
  private clipsService = inject(ClipsService);
  private appService = inject(AppService);
  private paneControlService = inject(SlideUpService);

  swiper = viewChild<ElementRef>('mySwiper');
  @ViewChild('svgContainer')
  svgContainer: ElementRef<HTMLDivElement>;

  progressVideo: boolean = true;
  selectedSlide = 0;
  activeIndex = 0;
  clips = computed(this.clipsService.clips);

  constructor() {
    effect(async (onMount) => {
      if (this.clips() && this.swiper()) {
        console.log(this.swiper().nativeElement);
        this.swiper().nativeElement.swiper.slideTo(0, 0, false);
        this.initSwiper();

        return onMount(() => {
          this.swiper().nativeElement.swiper.slideTo(0, 0, false);
        });
      }
    });
  }

  ionViewWillEnter() {
    this.clipsService.reload();
  }

  private initSwiper(): void {
    const swiperEl = this.swiper().nativeElement;
    Object.assign(swiperEl, {
      slidesPerView: 1,
      direction: 'vertical',
      loop: false,
      effect: 'fade',
      fadeEffect: {
        crossFade: true,
      },
      on: {
        slideChange: () => {
          const activeIndex = swiperEl.swiper.activeIndex;
          this.onSlideChange({
            detail: [{ activeIndex, params: { direction: 'vertical' } }],
          });
        },
      },
    });
    swiperEl.initialize();
  }

  async openSuggestions(post: Post) {
    this.paneControlService.present(post);
  }

  playAnimation(status: boolean | null) {
    if (status !== null) {
      this.animate(status);
      return;
    }
  }

  async showProfile(id: string) {
    this.appService.showProfile(id);
  }

  async share(clip: Post) {
    console.log('shareclip', clip);

    const share = await this.clipsService.share(clip);
    console.log('share', share);
  }

  onSlideChange(event) {
    if (event.detail[0].params.direction == 'vertical') {
      const index = event.detail[0].activeIndex as number;
      this.progressVideo = true;
      this.selectedSlide = this.activeIndex;

      this.activeIndex = index;
    }
    return;
  }

  videoEnded() {
    this.progressVideo = false;
  }

  updateProgress() {
    this.progressVideo = true;
  }

  ionViewDidLeave() {
    let video = document.getElementById(
      'video-' + this.activeIndex
    ) as HTMLVideoElement;
    video.pause();
  }

  animate(like: boolean) {
    if (like) {
      this.svgContainer.nativeElement.classList.add('animate-svg-up');
      setTimeout(() => {
        this.svgContainer.nativeElement.classList.remove('animate-svg-up');
      }, 2000);
    } else {
      this.svgContainer.nativeElement.classList.add('animate-svg-down');
      setTimeout(() => {
        this.svgContainer.nativeElement.classList.remove('animate-svg-down');
      }, 2000);
    }
  }
}
