import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'duration'
})
export class DurationPipe implements PipeTransform {
  transform(value: string): string {
    if(value.includes(' ')) return value;

    const parts = value.split(':');
    const days = parseInt(parts[0]);
    const hours = parseInt(parts[1]);
    const minutes = parseInt(parts[2]);

    let result = '';

    if (days > 0) {
      result += `${days}d `;
    }

    if (hours > 0) {
      result += `${hours}h `;
    }

    if (minutes > 0) {
      result += `${minutes}m`;
    }

    return result.trim();
  }
}
