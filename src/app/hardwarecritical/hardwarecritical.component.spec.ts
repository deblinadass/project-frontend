import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HardwarecriticalComponent } from './hardwarecritical.component';

describe('HardwarecriticalComponent', () => {
  let component: HardwarecriticalComponent;
  let fixture: ComponentFixture<HardwarecriticalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HardwarecriticalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HardwarecriticalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
