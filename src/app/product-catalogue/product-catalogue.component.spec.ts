import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductCatalogueComponent } from './product-catalogue.component';

describe('SublocationComponent', () => {
  let component: ProductCatalogueComponent;
  let fixture: ComponentFixture<ProductCatalogueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductCatalogueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductCatalogueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
