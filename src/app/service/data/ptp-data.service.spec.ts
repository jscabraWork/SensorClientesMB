import { TestBed } from '@angular/core/testing';

import { PtpDataService } from './ptp-data.service';

describe('PtpDataService', () => {
  let service: PtpDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PtpDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
