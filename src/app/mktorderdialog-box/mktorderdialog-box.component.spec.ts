import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MKTorderdialogBoxComponent } from './mktorderdialog-box.component';

describe('AccessdialogBoxComponent', () => {
  let component: MKTorderdialogBoxComponent;
  let fixture: ComponentFixture<MKTorderdialogBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MKTorderdialogBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MKTorderdialogBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
