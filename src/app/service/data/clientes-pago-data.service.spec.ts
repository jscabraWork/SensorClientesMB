import { TestBed } from '@angular/core/testing';

import { ClientesPagoDataService } from './clientes-pago-data.service';

describe('ClientesPagoDataService', () => {
  let service: ClientesPagoDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClientesPagoDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
