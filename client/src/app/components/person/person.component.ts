import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-person',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.scss']
})
export class PersonComponent {

  @Input() name: string;
  @Input() picture: string;
  @Input() linkedin: string;
  @Input() github: string;
  @Input() website: string;
  constructor() { }


}
