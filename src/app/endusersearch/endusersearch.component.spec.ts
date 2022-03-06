import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EndusersearchComponent } from './endusersearch.component';

describe('EndusersearchComponent', () => {
  let component: EndusersearchComponent;
  let fixture: ComponentFixture<EndusersearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EndusersearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EndusersearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
