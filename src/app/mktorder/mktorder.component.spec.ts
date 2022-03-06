import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MKTorderComponent } from './mktorder.component';

describe('AccessComponent', () => {
  let component: MKTorderComponent;
  let fixture: ComponentFixture<MKTorderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MKTorderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MKTorderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
