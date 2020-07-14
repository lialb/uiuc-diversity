import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as data from '../../../assets/colleges.json';

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

  constructor(private ar: ActivatedRoute, private router: Router) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false; // reload on param change
  }

  ngOnInit() {
    this.ar.paramMap.subscribe(params => {
      this.collegeAbbreviation = params.get('college');
    });
    this.collegeDescription = this.collegeData.find(college => college['abbreviation'] === this.collegeAbbreviation)['name'];
  }

}
