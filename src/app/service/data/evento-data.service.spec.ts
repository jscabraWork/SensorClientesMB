import { TestBed } from '@angular/core/testing';

import { EventoDataService } from './evento-data.service';

describe('EventoDataService', () => {
  let service: EventoDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventoDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
