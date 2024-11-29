import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'hashtag',
})
export class HashtagPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) {
      return value;
    }

    const hashtagRegex = /#(\w+)/g;
    return value.replace(
      hashtagRegex,
      '<a href="/hashtag/$1" class="hashtag">#$1</a>'
    );
  }
}
