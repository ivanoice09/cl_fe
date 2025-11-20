import { TestBed } from '@angular/core/testing';

import { ProductHttp } from './product-http';

describe('ProductHttp', () => {
  let service: ProductHttp;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductHttp);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
