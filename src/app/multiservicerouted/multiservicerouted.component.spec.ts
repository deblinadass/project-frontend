import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiserviceroutedComponent } from './multiservicerouted.component';

describe('MultiserviceroutedComponent', () => {
  let component: MultiserviceroutedComponent;
  let fixture: ComponentFixture<MultiserviceroutedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultiserviceroutedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiserviceroutedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
