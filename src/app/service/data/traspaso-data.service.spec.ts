import { TestBed } from '@angular/core/testing';

import { TraspasoDataService } from './traspaso-data.service';

describe('TraspasoDataService', () => {
  let service: TraspasoDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TraspasoDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
