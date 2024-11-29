import {
  Component,
  computed,
  ElementRef,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { Content } from '@core/models/content.model';

@Component({
  selector: 'app-video-details-contents',
  templateUrl: './video-details-contents.component.html',
  styleUrls: ['./video-details-contents.component.scss'],
})
export class VideoDetailsContentComponent {
  data = input.required<Content[]>({ alias: 'contents' });

  contents = computed(() => this.data().filter((item) => !item.video_path));

  pick = output<{ id: string; status: boolean; position: number }>();
  slide = output<number>();

  activeIndex = signal(0);
  selectedContent = computed(() => this.contents()[this.activeIndex()]);
  status = computed(() => this.selectedContent().pick_status);
  swiperContainer = viewChild<ElementRef>('mySwiper');

  onPick(status: boolean | null) {
    const foundPickStatusIndex = this.contents().findIndex(
      (item) => item.pick_status
    );

    console.log(foundPickStatusIndex);

    if (
      foundPickStatusIndex !== -1 &&
      this.contents()[foundPickStatusIndex].id !== this.selectedContent().id
    ) {
      return;
    }

    const position = this.contents().findIndex(
      (item) => item.id === this.selectedContent().id
    );

    this.pick.emit({
      id: this.selectedContent().id,
      status,
      position,
    });
  }

  onSlideChanged(event: number) {
    this.activeIndex.set(event);
    this.slide.emit(event);
  }
}
