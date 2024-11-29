import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-choice-image',
  templateUrl: './choice-image.component.html',
  styleUrls: ['./choice-image.component.scss'],
})
export class ChoiceImageComponent {
  @Input({ required: true }) image: string;
  @Input({ required: true }) index: number;

  @Output() takePicture = new EventEmitter<void>();
  @Output() editImage = new EventEmitter<void>();
  @Output() resetImage = new EventEmitter<void>();

  onResetImage() {
    this.resetImage.emit();
  }

  onTakePicture() {
    this.takePicture.emit();
  }

  onEditImage() {
    this.editImage.emit();
  }
}
