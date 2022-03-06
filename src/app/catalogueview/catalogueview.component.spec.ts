import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogueviewComponent } from './catalogueview.component';

describe('CatalogueviewComponent', () => {
  let component: CatalogueviewComponent;
  let fixture: ComponentFixture<CatalogueviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CatalogueviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CatalogueviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
