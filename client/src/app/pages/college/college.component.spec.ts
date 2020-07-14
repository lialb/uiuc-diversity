import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollegeComponent } from './college.component';

describe('CollegeComponent', () => {
  let component: CollegeComponent;
  let fixture: ComponentFixture<CollegeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollegeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollegeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
