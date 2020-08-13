import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LineCollegeComponent } from './line-college.component';

describe('LineCollegeComponent', () => {
  let component: LineCollegeComponent;
  let fixture: ComponentFixture<LineCollegeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LineCollegeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LineCollegeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
