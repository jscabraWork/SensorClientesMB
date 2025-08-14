import { TestBed } from '@angular/core/testing';

import { TransaccionDataService } from './transaccion-data.service';

describe('TransaccionDataService', () => {
  let service: TransaccionDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TransaccionDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
