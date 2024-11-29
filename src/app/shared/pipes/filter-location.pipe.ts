import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterLocation'
})
export class FilterLocationPipe implements PipeTransform {

  transform(items: any[], filter: any): any {
    if (!items || !filter) {
        return items;
    }
    console.log(items)
    // filter items array, items which match and return true will be
    // kept, false will be filtered out
    return items.filter(item => (item.name && item.name.common && item.name.common.toLowerCase().indexOf(filter.toLowerCase()) !== -1) || (item.capital && item.capital.length && item.capital[0].toLowerCase().indexOf(filter.toLowerCase()) !== -1) );
}

}
