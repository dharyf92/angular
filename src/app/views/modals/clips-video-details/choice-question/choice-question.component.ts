import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-choice-question',
  templateUrl: './choice-question.component.html',
  styleUrls: ['./choice-question.component.scss'],
})
export class ChoiceQuestionComponent {
  content = input.required<string>();
  index = input.required<number>();
  color = input.required<string>();

  insertText = output<void>();
  editText = output<void>();
  resetText = output<void>();

  onInsertText() {
    this.insertText.emit();
  }

  onEditText() {
    this.editText.emit();
  }

  onResetText() {
    this.resetText.emit();
  }
}
