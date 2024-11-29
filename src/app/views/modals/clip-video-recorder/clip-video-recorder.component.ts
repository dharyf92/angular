import { Component } from '@angular/core';

@Component({
  selector: 'app-clip-video-recorder',
  templateUrl: 'clip-video-recorder.component.html',
  styleUrls: ['clip-video-recorder.component.scss'],
})
export class ClipVideoRecorderComponent {
  recordValue: Blob;

  onRecordDone(data: Blob) {
    this.recordValue = data;
    console.log('onRecordDone', this.recordValue);
  }

  goBack() {
    this.recordValue = null;
  }
}
