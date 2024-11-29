import { Component, computed, input, output } from '@angular/core';

@Component({
  selector: 'app-picker',
  templateUrl: './picker.component.html',
  styleUrls: ['./picker.component.scss'],
})
export class PickerComponent {
  isMany = input<boolean>(true);
  status = input.required<boolean | null>();
  color = computed(() => {
    if (this.status() === null) {
      return '#3409B7';
    }
    return this.status() ? '#05DD71' : '#FA2243';
  });
  text = computed(() => {
    return {
      name: this.status() ? 'Picked' : 'Pick',
      height: '80px',
      Width: '80px',
    };
  });

  pick = output<boolean | null>();

  onPick(status: boolean | null) {
    this.pick.emit(status);
  }
}
