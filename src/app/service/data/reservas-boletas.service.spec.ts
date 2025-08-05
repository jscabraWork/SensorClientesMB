import { TestBed } from '@angular/core/testing';

import { ReservasBoletasService } from './reservas-boletas.service';

describe('ReservasBoletasService', () => {
  let service: ReservasBoletasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReservasBoletasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
