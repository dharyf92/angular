import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { IonicModule } from '@ionic/angular';
import { ClipVideoRecorderComponent } from './clip-video-recorder.component';
import { EditRecorderComponent } from './edit-recorder/edit-recorder.component';
import { IdleRecorderComponent } from './idle-recorder/idle-recorder.component';
import { PreviewRecorderComponent } from './preview-recorder/preview-recorder.component';

@NgModule({
  declarations: [
    ClipVideoRecorderComponent,
    IdleRecorderComponent,
    EditRecorderComponent,
    PreviewRecorderComponent,
  ],
  imports: [CommonModule, IonicModule],
  exports: [ClipVideoRecorderComponent],
})
export class ClipVideoRecorderModule {}
