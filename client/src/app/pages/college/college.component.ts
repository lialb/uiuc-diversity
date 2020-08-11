import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';
import * as d3 from 'd3';
import { legendColor } from 'd3-svg-legend';
import * as colleges from '../../../assets/colleges.json';
import * as data from '../../../../../data/json/2019.json'


interface margins {
  left: number,
  right: number,
  top: number,
  bottom: number
}

@Component({
  selector: 'app-college',
  templateUrl: './college.component.html',
  styleUrls: ['./college.component.scss']
})


export class CollegeComponent implements OnInit {

  selectedCollege: any = {};
  collegeAbbreviation: string = '';
  collegeData: Array<Object> = colleges.colleges;
  collegeDescription: string = '';
  collegeCode: string = '';
  showPieChart = false;
  majorData: any = {};

  graphMargin: margins = {
    left: 200,
    right: 20,
    top: 20,
    bottom: 20
  };
  svgWidth = 400;
  svgHeight = 900;
  barRange = 900;

  constructor(private ar: ActivatedRoute, private router: Router) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false; // reload on param change
  }

  ngOnInit() {
    this.ar.paramMap.subscribe(params => {
      this.collegeAbbreviation = params.get('college');
    });
    this.selectedCollege = this.collegeData.find(college => college['abbreviation'] === this.collegeAbbreviation);
    this.collegeDescription = this.selectedCollege.name; // Example: College of Education
    this.collegeCode = this.selectedCollege.code; // Example: 'KP' for Grainger
    const majorArray = data['default'][this.collegeCode].undergradTotal;
    majorArray.sort((a, b) => b.total - a.total)

    const svg = d3.select('.canvas');
    const graph = svg.append("g")
                    //  .attr("transform", "translate(" + this.graphMargin.left + "," + this.graphMargin.top + ")");
                     .attr("transform", `translate(${this.graphMargin.left}, 0)`);
    
    // x, y, color, stack are all functions
    let y: any;
    if (majorArray.length > 20) {
      y = d3.scaleBand()	// scaleBand for categorical data		
            .range([0, this.svgHeight - this.graphMargin.top - this.graphMargin.bottom])	// position of the canvas
            .domain(majorArray.map(entry => entry.major))  // domain should be an array of all the majors in this collge
            .paddingInner(0.2)
            .paddingOuter(0.2)
            .align(0.1);
    } else if (majorArray.length >= 8) {
      y = d3.scaleBand()	// scaleBand for categorical data		
            .range([0, 500 - this.graphMargin.top - this.graphMargin.bottom])	// position of the canvas
            .domain(majorArray.map(entry => entry.major))  // domain should be an array of all the majors in this collge
            .paddingInner(0.2)
            .paddingOuter(0.2)
            .align(0.1);
    } else if (majorArray.length >= 4) {
      y = d3.scaleBand()	// scaleBand for categorical data		
            .range([0, 300 - this.graphMargin.top - this.graphMargin.bottom])	// position of the canvas
            .domain(majorArray.map(entry => entry.major))  // domain should be an array of all the majors in this collge
            .paddingInner(0.2)
            .paddingOuter(0.2)
            .align(0.1);
    } else {
      y = d3.scaleBand()	// scaleBand for categorical data		
            .range([0, 100 - this.graphMargin.top - this.graphMargin.bottom])	// position of the canvas
            .domain(majorArray.map(entry => entry.major))  // domain should be an array of all the majors in this collge
            .paddingInner(0.2)
            .paddingOuter(0.2)
            .align(0.1);
    }


    const x = d3.scaleLinear()		// scaleLinear for numerical data
                .range([0, this.barRange])  //length of bar 
                .domain([0, d3.max(majorArray, d => d.total)]);	// domain of the bar chart from 0 to the biggest total in one major
              
    const keys = Object.keys(majorArray[0]).slice(6) //keys required to make stacked bar chart, which is each race
    const color = d3.scaleOrdinal(d3['schemeSet3']).domain(keys);  //scaleOrdinal 9 colors for 9 races

    // console.log(keys)
    const stack = d3.stack().keys(keys); //generate stacks
    const stackedData = stack(majorArray); // config the data to stacked data

    const yAxis = d3.axisLeft(y) //put the text on the left of the y-axis
                  .tickSize(0)
                  .tickPadding(2);
    
    let bargroups = graph.selectAll("g").data(stackedData)
                        .enter()
                        .append("g")
                        .attr("transform", `translate(5, 0)`)
                        .attr("fill", d => color(d.key));

    let rects = bargroups.selectAll('rect')
                          .data(d => d)
                          .enter().append("rect")
                          .attr("y", d => y(d.data.major))	    
                          .attr("x", d => x(d[0]))
                          .attr("width", d => x(d[1]) - x(d[0]))
                          .attr("height", y.bandwidth())
    
    const legendGroup = svg.append('g').attr('transform', `translate(30, 100)`);
  
    const legend = legendColor()
      // .shape('path', d3.symbol().type(d3.symbolCircle)())
      .shapePadding(80)
      .orient("horizontal")
      .scale(color);

    legendGroup.call(legend);
    legendGroup.selectAll('text')
               .attr('fill', 'black')
               .attr('font-size', 12);

    // const legend = svg.append('g')
    //       .attr('class', 'legend')
    //       .attr('transform', 'translate(0,0)');

    // const lg = legend.selectAll('g')
    //   .data(majorArray)
    //   .enter()
    //   .append('g')
    //   .attr('transform', (d,i) => `translate(${i * 100}, 25)`);

    // lg.append('rect')
    //   .style('fill', d => {
    //     console.log(d);
    //     return color(d.major)})
    //   .attr('x', 0)
    //   .attr('y', 0)
    //   .attr('width', 10)
    //   .attr('height', 10);

    // lg.append('text')
    //   .style('font-size', '13px')
    //   .attr('x', 17.5)
    //   .attr('y', 10)
    //   .text(d => d.major);

    graph.append('g')
        //  .attr('transform', 'translate(-10,2)')
         .call(yAxis).selectAll('text')
         .attr('fill', 'black')
         .attr('transform', 'translate(-5,0)')
  

    

  }


  // createPieChart(majorCode: number, isUndergrad: boolean) {
  //   this.showPieChart = true;
  //   if (isUndergrad) {
  //     this.majorData = data['default'][this.collegeCode].undergraduate.filter((x: { majorCode: number; }) => x.majorCode === majorCode);
  //   } else {
  //     this.majorData = data['default'][this.collegeCode].graduate.filter((x: { majorCode: number; }) => x.majorCode === majorCode);
  //   }
  //   console.log(this.majorData);
  // }

}
