import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LettersAgreementComponent } from './letters-agreement.component';

describe('LettersAgreementComponent', () => {
  let component: LettersAgreementComponent;
  let fixture: ComponentFixture<LettersAgreementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LettersAgreementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LettersAgreementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
