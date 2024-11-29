import { Pipe, PipeTransform } from '@angular/core';
import { Content } from '@core/models/content.model';

@Pipe({
  name: 'filterTitle',
})
export class FilterTitlePipe implements PipeTransform {
  transform(items: Array<Content>, filter: string) {
    if (!items || !filter) {
      return items;
    }
    // filter items array, items which match and return true will be
    // kept, false will be filtered out
    return items.filter(
      (item) =>
        item.link_metadata &&
        item.link_metadata.title.toLowerCase().indexOf(filter.toLowerCase()) !==
          -1
    );
  }
}
