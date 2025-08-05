import { TestBed } from '@angular/core/testing';

import { PromotorDataService } from './promotor-data.service';

describe('PromotorDataService', () => {
  let service: PromotorDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PromotorDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
