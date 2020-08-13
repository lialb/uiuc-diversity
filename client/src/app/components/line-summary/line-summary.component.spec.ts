import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LineSummaryComponent } from './line-summary.component';

describe('LineSummaryComponent', () => {
  let component: LineSummaryComponent;
  let fixture: ComponentFixture<LineSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LineSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LineSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
