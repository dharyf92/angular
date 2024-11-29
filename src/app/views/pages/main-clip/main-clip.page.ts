import {
  Component,
  ElementRef,
  inject,
  input,
  signal,
  ViewChild,
} from '@angular/core';
import { Post } from '@core/models/post.model';
import { ClipsService } from '@shared/services/clips/clips.service';
import { SlideUpService } from '@shared/services/slide-up/slide-up.service';

@Component({
  selector: 'app-main-clip',
  templateUrl: './main-clip.page.html',
  styleUrls: ['./main-clip.page.scss'],
})
export class MainClipPage {
  private readonly clipsService = inject(ClipsService);
  private readonly slideUpService = inject(SlideUpService);

  @ViewChild('svgContainer') svgContainer: ElementRef<HTMLDivElement>;

  id = input.required<string>();
  clip = signal<Post | null>(null);
  progressVideo = signal(true);

  getVideo = this.clipsService.getVideo;
  getThumbnail = this.clipsService.getThumbnail;

  ionViewWillEnter() {
    this.clipsService.get(this.id()).subscribe((res) => {
      this.clip.set(res);
    });
  }

  openSuggestions() {
    this.slideUpService.present(this.clip());
  }

  videoEnded() {
    this.progressVideo.set(false);
  }

  updateProgress() {
    this.progressVideo.set(true);
  }

  playAnimation(status: boolean) {
    if (status) {
      this.animate(status);
      return;
    }
    if (status !== null) {
      this.animate(status);
      return;
    }
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
