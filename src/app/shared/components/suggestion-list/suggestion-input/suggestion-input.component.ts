import {
  Component,
  computed,
  input,
  model,
  output,
  signal,
} from '@angular/core';

@Component({
  selector: 'app-suggestion-input',
  templateUrl: './suggestion-input.component.html',
  styleUrls: ['./suggestion-input.component.scss'],
})
export class SuggestionInputComponent {
  message = model<string>('');
  oldMessage = signal<string>('');

  type = input<'edit' | 'add' | 'reply'>('add');

  submit = output<string>();

  isActive = computed(
    () =>
      this.message() !== '' &&
      (this.type() === 'add' ||
        this.type() === 'reply' ||
        (this.type() === 'edit' && this.oldMessage() !== this.message()))
  );

  onSubmit() {
    console.log(this.message());
    this.submit.emit(this.message());
  }

  reset() {
    this.message.set('');
    this.oldMessage.set('');
  }

  edit(message: string) {
    this.message.set(message);
    this.oldMessage.set(message);
  }
}
