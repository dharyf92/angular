import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sort'
})
export class SortPipe implements PipeTransform {

  transform(value: string[]): any {
      // Use a copy of your array if you want to keep the original untouched
      return [...value].sort((a:any, b:any) => {
        a = a.name.common.toLowerCase(); // or a.toLocaleLowerCase()
        b = b.name.common.toLowerCase(); // or b.toLocaleLowerCase()
        return a.localeCompare(b);
      })
  }

}
