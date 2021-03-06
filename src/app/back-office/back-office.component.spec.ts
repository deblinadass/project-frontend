import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BackOfficeComponent } from './back-office.component';

describe('SublocationComponent', () => {
  let component: BackOfficeComponent;
  let fixture: ComponentFixture<BackOfficeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BackOfficeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BackOfficeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
