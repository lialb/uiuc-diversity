import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';
import * as d3 from 'd3';
import * as data from '../../../assets/colleges.json';
import * as datain from '../../../../../data/json/2019.json'

@Component({
  selector: 'app-college',
  templateUrl: './college.component.html',
  styleUrls: ['./college.component.scss']
})
export class CollegeComponent implements OnInit {

  collegeAbbreviation: string = '';
  collegeData: Array<Object> = data.colleges;
  collegeDescription: string = '';
  index: number = 0;
  specCollege: Array<Object> = datain.KP.undergraduate;

  constructor(private ar: ActivatedRoute, private router: Router) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false; // reload on param change
  }

  ngOnInit() {
    this.ar.paramMap.subscribe(params => {
      this.collegeAbbreviation = params.get('college');
    });
    this.collegeDescription = this.collegeData.find(college => college['abbreviation'] === this.collegeAbbreviation)['name'];
    const majorArr = this.handleMajorArr();
    const cs = this.specCollege.filter(entry => entry['major'] === 'Computer Science');
    const svg = d3.select('.canvas')
    const pie = d3.pie().sort(null).value(d => d.count)
    const arcPath = d3.arc().innerRadius(1).outerRadius(150)
    const graph = svg.append('g').attr('transform', 'translate(140, 150)')
    const paths = graph.selectAll('path').data(pie(cs));

    paths.enter()
        .append('path')
        .attr('d', arcPath)
        // .attr('fill', d => color(d.data.race))
        .attr('stroke', 'white')
        .attr('stroke-width', 3)
    
  }

  handleMajorArr() {
    const majorArr: Array<String> = []
    this.specCollege.forEach(entry => {
      majorArr.push(entry['major'])
    })
    const uniqueMajorArr: Array<string> = _.uniq(majorArr);
    return uniqueMajorArr
  }

}
