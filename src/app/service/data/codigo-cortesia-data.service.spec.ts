import { TestBed } from '@angular/core/testing';

import { CodigoCortesiaDataService } from './codigo-cortesia-data.service';

describe('CodigoCortesiaDataService', () => {
  let service: CodigoCortesiaDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CodigoCortesiaDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
