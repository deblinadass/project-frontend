import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketauditlogComponent } from './ticketauditlog.component';

describe('AuditlogComponent', () => {
  let component: TicketauditlogComponent;
  let fixture: ComponentFixture<TicketauditlogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketauditlogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketauditlogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
