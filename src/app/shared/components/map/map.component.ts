import { Component, computed, effect, input } from '@angular/core';
import { PickersWhereabouts } from '@core/models/post.model';
import { ChartType, GoogleChartsModule } from 'angular-google-charts';

@Component({
  standalone: true,
  imports: [GoogleChartsModule],
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent {
  readonly title = 'Pickers by region';
  readonly type: ChartType = ChartType.GeoChart;

  whereabouts = input<PickersWhereabouts[]>([]);

  data = computed(() => [
    ...this.whereabouts().map((whereabouts) => [
      whereabouts.country,
      whereabouts.count,
    ]),
    // ['United States', 300],
    // ['Brazil', 400],
    // ['Canada', 500],
    // ['Morocco', 600],
  ]);

  columnNames = ['Country', 'Count'];
  options = {
    colorAxis: { colors: ['#EBE6F8', '#3409B7'] }, // From light blue to dark blue
    backgroundColor: '#ffffff', // Background color of the chart
    datalessRegionColor: '#EBE6F8', // Color for regions with no data
    defaultColor: '#EBE6F8', // Default color for data regions
  };

  constructor() {
    effect(() => console.log(this.whereabouts(), 'data: ', this.data()));
  }
}
