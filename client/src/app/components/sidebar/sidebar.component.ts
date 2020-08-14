import { Component, OnInit, ElementRef, HostListener } from '@angular/core';
import * as data from '../../../assets/colleges.json';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  colleges = data.colleges;

  constructor(private router: Router, private er: ElementRef) {}

  ngOnInit() {
  }

  navbarClosed = true;
  
  openNav(): void {
    document.getElementById("mySidebar").style.width = "250px";
    document.getElementById("main").style.marginLeft = "250px";
    document.getElementById("main").style.visibility = "hidden";
    this.navbarClosed = false;
  }
  
  /* Set the width of the sidebar to 0 and the left margin of the page content to 0 */
  closeNav(): void {
    document.getElementById("mySidebar").style.width = "0";
    document.getElementById("main").style.marginLeft = "0";
    document.getElementById("main").style.visibility = "visible";
    this.navbarClosed = true;
  }

  // close side menu when user clicks outside
  @HostListener('document:click', ['$event'])
  clickout(event: { target: any; }): void {
    if (!this.er.nativeElement.contains(event.target)) {
      this.closeNav();
    }
  }

  selectCollege(abbreviation: string): void {
    let level: string = 'undergrad';
    if (abbreviation === 'DGS' || abbreviation === 'CITL') {
      level = 'nondegree';
    } else if (['GRAD', 'MED'].indexOf(abbreviation) > -1) {
      level = 'doctorate';
    } else if (['IS', 'VM', 'LAW', 'LER'].indexOf(abbreviation) > -1) {
      level = 'masters';
    } 
    this.router.navigate(['/college', abbreviation, level]);
  }
}
