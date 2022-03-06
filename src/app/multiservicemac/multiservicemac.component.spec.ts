import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiservicemacComponent } from './multiservicemac.component';

describe('MultiservicemacComponent', () => {
  let component: MultiservicemacComponent;
  let fixture: ComponentFixture<MultiservicemacComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultiservicemacComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiservicemacComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
