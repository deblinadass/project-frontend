import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpeninghoursComponent } from './openinghours.component';

describe('OpeninghoursComponent', () => {
  let component: OpeninghoursComponent;
  let fixture: ComponentFixture<OpeninghoursComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpeninghoursComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpeninghoursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
