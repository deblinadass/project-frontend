import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LetteragreementformComponent } from './letteragreementform.component';

describe('LetteragreementformComponent', () => {
  let component: LetteragreementformComponent;
  let fixture: ComponentFixture<LetteragreementformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LetteragreementformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LetteragreementformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
