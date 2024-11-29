import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AvatarComponent } from '@shared/components/avatar/avatar.component';
import { ChoiceImageComponent } from './choice-image/choice-image.component';
import { ChoiceQuestionComponent } from './choice-question/choice-question.component';
import { ClipsVideoDetailsComponent } from './clips-video-details.component';
import { ContrastDirective } from '@shared/directives/contrast.directive';

@NgModule({
  declarations: [
    ClipsVideoDetailsComponent,
    ChoiceImageComponent,
    ChoiceQuestionComponent,
  ],
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    AvatarComponent,
    ContrastDirective,
  ],
  exports: [ClipsVideoDetailsComponent],
})
export class ClipsVideoDetailsModule {}
