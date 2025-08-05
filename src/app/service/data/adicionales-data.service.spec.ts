import { TestBed } from '@angular/core/testing';

import { AdicionalesDataService } from './adicionales-data.service';

describe('AdicionalesDataService', () => {
  let service: AdicionalesDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdicionalesDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
