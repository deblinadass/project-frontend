import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillingExportComponent } from './billingexport.component';

describe('BillingExportComponent', () => {
  let component: BillingExportComponent;
  let fixture: ComponentFixture<BillingExportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillingExportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillingExportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
