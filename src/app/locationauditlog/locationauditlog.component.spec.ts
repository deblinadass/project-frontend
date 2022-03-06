import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationauditlogComponent } from './locationauditlog.component';

describe('LocationauditlogComponent', () => {
  let component: LocationauditlogComponent;
  let fixture: ComponentFixture<LocationauditlogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocationauditlogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationauditlogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
