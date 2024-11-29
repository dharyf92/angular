import {
  Component,
  ElementRef,
  inject,
  input,
  OnInit,
  output,
  ViewChild,
} from '@angular/core';
import { ModalController } from '@ionic/angular';
import { VideoFrame, VideoToFramesMethod } from '@shared/libs/video-frame';
import { MediaService } from '@shared/services/media/media.service';

@Component({
  selector: 'app-edit-recorder',
  templateUrl: './edit-recorder.component.html',
  styleUrls: ['./edit-recorder.component.scss'],
})
export class EditRecorderComponent implements OnInit {
  frames: string[];
  blob = input.required<Blob>();
  cancel = output<void>();
  isReady = false;

  @ViewChild('video', { static: true }) video: ElementRef<HTMLVideoElement>;
  private readonly mediaService = inject(MediaService);
  private readonly modalController = inject(ModalController);

  async ngOnInit() {
    const url = URL.createObjectURL(this.blob());

    this.frames = await VideoFrame.getFrames(
      url,
      4,
      VideoToFramesMethod.totalFrames
    );

    this.video.nativeElement.src = url;
    await this.video.nativeElement.play();
    this.isReady = true;
  }

  saveVideo = async () => {
    this.video.nativeElement.pause();
    this.video.nativeElement.src = null;
    const video = await this.mediaService.storeVideo(this.blob());
    this.modalController.dismiss(
      {
        ...video,
        thumbnail: this.frames[0],
      },
      'done'
    );
  };

  goBack() {
    this.cancel.emit();
  }
}
