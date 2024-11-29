import {
  AfterViewInit,
  Component,
  computed,
  EventEmitter,
  inject,
  input,
  Input,
  OnChanges,
  Output,
} from '@angular/core';
import { Post as Clip } from '@core/models/post.model';
import { ClipsService } from '@shared/services/clips/clips.service';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss'],
})
export class VideoComponent implements AfterViewInit, OnChanges {
  private readonly clipsService = inject(ClipsService);
  video: HTMLVideoElement;
  progressBar: HTMLElement;
  progressContainer: HTMLElement;
  isDragging = false;
  isFinished = false;

  @Input() activeIndex: number;
  @Input() oldIndex: number;

  clip = input.required<Clip>();
  index = input(0);
  src = computed(() => this.clipsService.getVideo(this.clip()));
  poster = computed(() => this.clipsService.getThumbnail(this.clip()));

  @Output() onVideoFinished = new EventEmitter<void>();
  @Output() onUpdateProgressEvent = new EventEmitter<void>();

  ngAfterViewInit() {
    this.loadVideo();
  }

  async loadVideo() {
    this.isFinished = false;
    let index = this.index() === this.activeIndex ? this.index() : -1;
    this.video = document.getElementById('video-' + index) as HTMLVideoElement;
    if (this.video) {
      this.progressBar = document.getElementById('progress-bar' + index);
      this.progressContainer = document.getElementById(
        'progress-container' + index
      );

      this.video.addEventListener('timeupdate', this.updateProgressBar);
      this.progressContainer.addEventListener('mousedown', this.onMouseDown);
      document.addEventListener('mousemove', this.onMouseMove);
      document.addEventListener('mouseup', this.onMouseUp);
      this.progressContainer.addEventListener('touchstart', this.onTouchStart);
      document.addEventListener('touchmove', this.onTouchMove);
      document.addEventListener('touchend', this.onTouchEnd);

      this.video.addEventListener('ended', this.onVideoEnded);

      this.video.play();
    }
  }

  async ngOnChanges() {
    if (this.oldIndex !== this.activeIndex) {
      this.video = document.getElementById(
        'video-' + this.oldIndex
      ) as HTMLVideoElement;
      this.video?.pause();
    }
    await this.loadVideo();
  }

  async calculateProgressPercentage(): Promise<number> {
    while (this.video.duration === Infinity) {
      await new Promise((r) => setTimeout(r, 1000));
      this.video.currentTime = 10000000 * Math.random();
    }
    if (this.video && this.video.duration) {
      return (this.video.currentTime * 100) / this.video.duration;
    }
    return 0;
  }

  updateProgressBar = async () => {
    const progress = await this.calculateProgressPercentage();
    this.progressBar.style.width = `${progress}%`;
  };

  updateProgress = (event: any) => {
    if (event && event.touches && event.touches.length > 0) {
      console.log(event);
      const clientX =
        event instanceof MouseEvent
          ? event.clientX
          : event?.touches[0]?.clientX;
      const rect = this.progressContainer.getBoundingClientRect();
      const offsetX = clientX - rect.left;
      const totalWidth = this.progressContainer.offsetWidth;
      const progress = Math.max(0, Math.min(100, (offsetX / totalWidth) * 100));
      this.progressBar.style.width = `${progress}%`;
      this.video.currentTime = (progress / 100) * this.video.duration;
      this.video.play();
      this.onUpdateProgressEvent.emit();
    }
  };

  onMouseDown = (event: MouseEvent) => {
    this.isDragging = true;
    this.updateProgress(event);
  };

  onMouseMove = (event: MouseEvent) => {
    if (this.isDragging) {
      this.updateProgress(event);
    }
  };

  onMouseUp = () => {
    this.isDragging = false;
  };

  onTouchStart = (event: TouchEvent) => {
    this.isDragging = true;
    this.updateProgress(event);
  };

  onTouchMove = (event: TouchEvent) => {
    if (this.isDragging) {
      this.updateProgress(event);
    }
  };

  onTouchEnd = () => {
    this.isDragging = false;
  };

  onVideoEnded = () => {
    this.isFinished = true;
    this.onVideoFinished.emit();
  };
}
