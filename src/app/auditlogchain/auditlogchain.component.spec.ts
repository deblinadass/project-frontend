import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditlogchainComponent } from './auditlogchain.component';

describe('AuditlogchainComponent', () => {
  let component: AuditlogchainComponent;
  let fixture: ComponentFixture<AuditlogchainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuditlogchainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditlogchainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
