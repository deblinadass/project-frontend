import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiservicewlanComponent } from './multiservicewlan.component';

describe('MultiservicewlanComponent', () => {
  let component: MultiservicewlanComponent;
  let fixture: ComponentFixture<MultiservicewlanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultiservicewlanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiservicewlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
