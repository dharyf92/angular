import { NgStyle } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss'],
  standalone: true,
  imports: [NgStyle],
})
export class AvatarComponent {
  src = input('/assets/images/avatar.png');
  size = input('40px');
}
