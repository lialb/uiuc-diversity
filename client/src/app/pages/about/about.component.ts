import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

  staff = [
    {
      "name": "Albert",
      "picture": "albert.jpg",
      "linkedin": "https://linkedin.com/in/albearli",
      "github": "https://github.com/albearli",
      "website": "https://lialbert.com"
    },
    {
      "name": "Bryant",
      "picture": "bryant.jpeg",
      "linkedin": "https://www.linkedin.com/in/tianyi-zhou-967991193/",
      "github": "https://github.com/tianyiz8",
    }];

  constructor() { }

  ngOnInit() {
  }

}
