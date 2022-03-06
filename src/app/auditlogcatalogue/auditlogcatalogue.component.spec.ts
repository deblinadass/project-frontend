import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditlogcatalogueComponent } from './auditlogcatalogue.component';

describe('AuditlogcatalogueComponent', () => {
  let component: AuditlogcatalogueComponent;
  let fixture: ComponentFixture<AuditlogcatalogueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuditlogcatalogueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditlogcatalogueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
