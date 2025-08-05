import { TestBed } from '@angular/core/testing';

import { RecuperacionDataService } from './recuperacion-data.service';

describe('RecuperacionDataService', () => {
  let service: RecuperacionDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecuperacionDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
