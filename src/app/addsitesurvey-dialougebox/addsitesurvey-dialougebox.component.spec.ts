import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddsitesurveyDialougeboxComponent } from './addsitesurvey-dialougebox.component';

describe('AddsitesurveyDialougeboxComponent', () => {
  let component: AddsitesurveyDialougeboxComponent;
  let fixture: ComponentFixture<AddsitesurveyDialougeboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddsitesurveyDialougeboxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddsitesurveyDialougeboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
