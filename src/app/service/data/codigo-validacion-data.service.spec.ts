import { TestBed } from '@angular/core/testing';

import { CodigoValidacionDataService } from './codigo-validacion-data.service';

describe('CodigoValidacionDataService', () => {
  let service: CodigoValidacionDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CodigoValidacionDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
