import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChaindialogBoxComponent } from './chaindialog-box.component';

describe('ChaindialogBoxComponent', () => {
  let component: ChaindialogBoxComponent;
  let fixture: ComponentFixture<ChaindialogBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChaindialogBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChaindialogBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
