import { TestBed } from '@angular/core/testing';

import { MapaDataServiceService } from './mapa-data.service.service';

describe('MapaDataServiceService', () => {
  let service: MapaDataServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MapaDataServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
