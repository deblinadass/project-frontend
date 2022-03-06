import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BackofficeAuditlogComponent } from './backofficeauditlog.component';

describe('AuditlogComponent', () => {
  let component: BackofficeAuditlogComponent;
  let fixture: ComponentFixture<BackofficeAuditlogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BackofficeAuditlogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BackofficeAuditlogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
