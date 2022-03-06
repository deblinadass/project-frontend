import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiserviceSsidComponent } from './multiservice-ssid.component';

describe('MultiserviceSsidComponent', () => {
  let component: MultiserviceSsidComponent;
  let fixture: ComponentFixture<MultiserviceSsidComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultiserviceSsidComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiserviceSsidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
