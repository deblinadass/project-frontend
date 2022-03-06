import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BackofficeorderComponent } from './backofficeorder.component';

describe('BackofficeorderComponent', () => {
  let component: BackofficeorderComponent;
  let fixture: ComponentFixture<BackofficeorderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BackofficeorderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BackofficeorderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
