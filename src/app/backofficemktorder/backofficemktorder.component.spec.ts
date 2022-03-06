import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BackofficeMKTorderComponent } from './backofficemktorder.component';

describe('AccessComponent', () => {
  let component: BackofficeMKTorderComponent;
  let fixture: ComponentFixture<BackofficeMKTorderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BackofficeMKTorderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BackofficeMKTorderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
