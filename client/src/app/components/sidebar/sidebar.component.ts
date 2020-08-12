import { Component, OnInit } from '@angular/core';
import * as data from '../../../assets/colleges.json';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  colleges = data.colleges;

  constructor(private router: Router) {}

  ngOnInit() {
  }

  navbarClosed = true;
  
  openNav() {
    document.getElementById("mySidebar").style.width = "250px";
    document.getElementById("main").style.marginLeft = "250px";
    document.getElementById("main").style.visibility = "hidden";
    this.navbarClosed = false;
  }
  
  /* Set the width of the sidebar to 0 and the left margin of the page content to 0 */
  closeNav() {
    document.getElementById("mySidebar").style.width = "0";
    document.getElementById("main").style.marginLeft = "0";
    document.getElementById("main").style.visibility = "visible";
    this.navbarClosed = true;
  }

  selectCollege(abbreviation: string) {
    let level: string = 'undergrad';
    if (abbreviation === 'DGS') {
      level = 'nondegree';
    } else if (abbreviation === 'GRAD') {
      level = 'doctorate';
    } else if (['IS', 'VM', 'LAW'].indexOf(abbreviation) > -1) {
      level = 'masters';
    }
    this.router.navigate(['/college', abbreviation, level]);
  }


}
