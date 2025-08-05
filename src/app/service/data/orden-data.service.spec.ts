import { TestBed } from '@angular/core/testing';

import { OrdenDataService } from './orden-data.service';

describe('OrdenDataService', () => {
  let service: OrdenDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrdenDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
