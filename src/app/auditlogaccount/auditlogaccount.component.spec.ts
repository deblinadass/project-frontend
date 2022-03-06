import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditlogaccountComponent } from './auditlogaccount.component';

describe('AuditlogaccountComponent', () => {
  let component: AuditlogaccountComponent;
  let fixture: ComponentFixture<AuditlogaccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuditlogaccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditlogaccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
