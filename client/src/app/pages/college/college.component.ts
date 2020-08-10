import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';
import * as colleges from '../../../assets/colleges.json';
import * as data from '../../../../../data/json/2019.json'

@Component({
  selector: 'app-college',
  templateUrl: './college.component.html',
  styleUrls: ['./college.component.scss']
})
export class CollegeComponent implements OnInit {

  collegeAbbreviation: string = '';
  collegeData: Array<Object> = colleges.colleges;
  collegeDescription: string = '';
  collegeCode: string = '';
  showPieChart = false;
  majorData: any = {};

  constructor(private ar: ActivatedRoute, private router: Router) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false; // reload on param change
  }

  ngOnInit() {
    this.ar.paramMap.subscribe(params => {
      this.collegeAbbreviation = params.get('college');
    });
    this.collegeDescription = this.collegeData.find(college => college['abbreviation'] === this.collegeAbbreviation)['name'];
    this.collegeCode = this.collegeData.find(college => college['abbreviation'] === this.collegeAbbreviation)['code'];
  }

  createPieChart(majorCode: number, isUndergrad: boolean) {
    this.showPieChart = true;
    if (isUndergrad) {
      this.majorData = data['default'][this.collegeCode].undergraduate.filter((x: { majorCode: number; }) => x.majorCode === majorCode);
    } else {
      this.majorData = data['default'][this.collegeCode].graduate.filter((x: { majorCode: number; }) => x.majorCode === majorCode);
    }
    console.log(this.majorData);
  }

}
