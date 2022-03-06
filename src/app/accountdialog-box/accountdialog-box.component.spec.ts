import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountdialogBoxComponent } from './accountdialog-box.component';

describe('AccountdialogBoxComponent', () => {
  let component: AccountdialogBoxComponent;
  let fixture: ComponentFixture<AccountdialogBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountdialogBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountdialogBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
