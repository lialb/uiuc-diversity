import { Component, OnInit, Input } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-piechart',
  templateUrl: './piechart.component.html',
  styleUrls: ['./piechart.component.scss']
})
export class PiechartComponent implements OnInit {
  @Input() data: any;

  constructor() { }

  ngOnInit() {
    const svg = d3.select('.canvas');
    const pie = d3.pie().sort(null).value(d => d.count);
    const arcPath = d3.arc().innerRadius(1).outerRadius(150);
    const graph = svg.append('g').attr('transform', 'translate(140, 150)');
    const paths = graph.selectAll('path').data(pie(this.data));
    const color = d3.scaleOrdinal(d3['schemeSet3']).domain(this.data.map(x => x.race));

    paths.enter()
        .append('path')
        .attr('d', arcPath)
        .attr('fill', d => color(d.data.race))
        .attr('stroke', 'white')
        .attr('stroke-width', 3);
    
  }

}
