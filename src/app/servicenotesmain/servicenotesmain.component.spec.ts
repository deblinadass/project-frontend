import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BouwfunnelComponent } from './bouwfunnel.component';

describe('BouwfunnelComponent', () => {
  let component: BouwfunnelComponent;
  let fixture: ComponentFixture<BouwfunnelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BouwfunnelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BouwfunnelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
