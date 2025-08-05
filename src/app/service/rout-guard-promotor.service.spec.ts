import { TestBed } from '@angular/core/testing';

import { RoutGuardPromotorService } from './rout-guard-promotor.service';

describe('RoutGuardPromotorService', () => {
  let service: RoutGuardPromotorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RoutGuardPromotorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
