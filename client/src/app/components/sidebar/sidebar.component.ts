import { Component, OnInit } from '@angular/core';
import * as data from '../../../assets/colleges.json';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  colleges = data.colleges;

  ngOnInit() {
  }

  navbarClosed = true;
  
  openNav() {
    document.getElementById("mySidebar").style.width = "250px";
    document.getElementById("main").style.marginLeft = "250px";
    this.navbarClosed = false;
  }
  
  /* Set the width of the sidebar to 0 and the left margin of the page content to 0 */
  closeNav() {
    document.getElementById("mySidebar").style.width = "0";
    document.getElementById("main").style.marginLeft = "0";
    this.navbarClosed = true;
  }


}
