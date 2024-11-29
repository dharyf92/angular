import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeAgo',
})
export class TimeAgoPipe implements PipeTransform {
  transform(dateString: string): string {
    const date = new Date(dateString);
    const currentDate = new Date();

    const yearDiff = currentDate.getFullYear() - date.getFullYear();
    if (yearDiff > 0) {
      return yearDiff === 1 ? '1 year ago' : yearDiff + ' years ago';
    }

    const monthDiff = currentDate.getMonth() - date.getMonth();
    if (monthDiff > 0) {
      return monthDiff === 1 ? '1 month ago' : monthDiff + ' months ago';
    }

    const dayDiff = currentDate.getDate() - date.getDate();
    if (dayDiff > 0) {
      return dayDiff === 1 ? '1 day ago' : dayDiff + ' days ago';
    }

    const hourDiff = currentDate.getHours() - date.getHours();
    if (hourDiff > 0) {
      return hourDiff === 1 ? '1 hour ago' : hourDiff + ' hours ago';
    }

    const minuteDiff = currentDate.getMinutes() - date.getMinutes();
    if (minuteDiff > 0) {
      return minuteDiff === 1 ? '1 minute ago' : minuteDiff + ' minutes ago';
    }

    return 'just now';
  }
}
