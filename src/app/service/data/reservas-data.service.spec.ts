import { TestBed } from '@angular/core/testing';

import { ReservasDataService } from './reservas-data.service';

describe('ReservasDataService', () => {
  let service: ReservasDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReservasDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
