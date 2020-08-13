import { Component, OnInit, Input } from '@angular/core';
import { Color, Label } from 'ng2-charts';
import { ChartDataSets, ChartOptions } from 'chart.js';
import * as combinedData from '../../../assets/json/combinedSummary.json';

@Component({
  selector: 'app-line-summary',
  templateUrl: './line-summary.component.html',
  styleUrls: ['./line-summary.component.scss']
})
export class LineSummaryComponent implements OnInit {

  @Input() showUndergrad: boolean;

  lineChartData: ChartDataSets[] = [
    { data: [], label: 'Caucasian' },
    { data: [], label: 'Asian American' },
    { data: [], label: 'African American' },
    { data: [], label: 'Hispanic' },
    { data: [], label: 'Native American' },
    { data: [], label: 'Hawaiian/ Pacific Isl' },
    { data: [], label: 'Multiracial' },
    { data: [], label: 'International' },
    { data: [], label: 'Unknown' },
  ];


  lineChartOptions = {
    responsive: true,
  };

  lineChartColors: Color[] = [
    {
      borderColor: 'black',
      backgroundColor: 'rgba(255,255,0,0.28)',
    },
  ];
  lineChartLabels = [];
  lineChartLegend = true;
  lineChartPlugins = [];
  lineChartType = 'line';

  lineChoice = 'KV'; // Default is LAS
  
  lineColors = [];

  constructor() { }

  ngOnInit() {
    for (let i = 2004; i <= 2019; ++i) {
      this.lineChartLabels.push(i);
    }
    this.initLineChart();
  }

  initLineChart(): void {
    let labels = ['Caucasian', 'Asian American', 'African American', 'Hispanic', 'Native American', 'Hawaiian/ Pacific Isl', 'Multiracial', 'International', 'Unknown'];
    if (this.showUndergrad) {
      for (let i = 0; i < labels.length; ++i) {
        this.lineChartData[i]['data'] = combinedData['default'][this.lineChoice]['undergradTotal'][i]['data'];
      }
    } else {
      for (let i = 0; i < labels.length; ++i) {
        this.lineChartData[i]['data'] = combinedData['default'][this.lineChoice]['gradTotal'][i]['data'];
      }
    }

  }

  chooseLineGraph(choice: string): void {
    this.lineChoice = choice;
    this.initLineChart();
  }
}
