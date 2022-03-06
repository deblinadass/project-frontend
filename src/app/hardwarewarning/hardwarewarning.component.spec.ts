import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HardwarewarningComponent } from './hardwarewarning.component';

describe('HardwarewarningComponent', () => {
  let component: HardwarewarningComponent;
  let fixture: ComponentFixture<HardwarewarningComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HardwarewarningComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HardwarewarningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
