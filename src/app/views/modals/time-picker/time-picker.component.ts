import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-time-picker',
  templateUrl: './time-picker.component.html',
  styleUrls: ['./time-picker.component.scss'],
})
export class TimePickerComponent implements OnInit {


  constructor(private modalController: ModalController) {}

  ngOnInit() {}

  @Input() selectedHour: number;
  @Input() selectedMinute: number;
  @Input() selectedSecond: number;

  hours: number[] = Array.from({ length: 24 }, (_, i) => i);
  minutes: number[] = Array.from({ length: 60 }, (_, i) => i);
  seconds: number[] = Array.from({ length: 60 }, (_, i) => i);


  closeModal() {
    this.modalController.dismiss();
  }

  selectHour(hour: number) {
    this.selectedHour = hour;
  }

  selectMinute(minute: number) {
    this.selectedMinute = minute;
  }

  selectSecond(second: number) {
    this.selectedSecond = second;
  }

  applySelectedTime() {
    this.modalController.dismiss({
      selectedHour: this.selectedHour,
      selectedMinute: this.selectedMinute,
      selectedSecond: this.selectedSecond,
    }, 'apply');
  }

}
