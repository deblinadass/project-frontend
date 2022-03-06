import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EndusercreateComponent } from './endusercreate.component';

describe('EndusercreateComponent', () => {
  let component: EndusercreateComponent;
  let fixture: ComponentFixture<EndusercreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EndusercreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EndusercreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
