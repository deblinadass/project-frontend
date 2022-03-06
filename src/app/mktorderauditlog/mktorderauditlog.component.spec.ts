import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MKTorderauditlogComponent } from './mktorderauditlog.component';

describe('AuditlogComponent', () => {
  let component: MKTorderauditlogComponent;
  let fixture: ComponentFixture<MKTorderauditlogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MKTorderauditlogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MKTorderauditlogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
