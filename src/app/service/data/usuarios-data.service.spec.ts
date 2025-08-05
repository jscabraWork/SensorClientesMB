import { TestBed } from '@angular/core/testing';

import { UsuariosDataService } from './usuarios-data.service';

describe('UsuariosDataService', () => {
  let service: UsuariosDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsuariosDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
