import { TestBed } from '@angular/core/testing';

import { ClientVendorService } from './client-vendor.service';

describe('ClientVendorService', () => {
  let service: ClientVendorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClientVendorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
