import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OnetimecostsequencedialogBoxComponent } from './onetimecostsequencedialog-box.component';

describe('OnetimecostsequencedialogBoxComponent', () => {
  let component: OnetimecostsequencedialogBoxComponent;
  let fixture: ComponentFixture<OnetimecostsequencedialogBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OnetimecostsequencedialogBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnetimecostsequencedialogBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
