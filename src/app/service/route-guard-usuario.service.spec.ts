import { TestBed } from '@angular/core/testing';

import { RouteGuardUsuarioService } from './route-guard-usuario.service';

describe('RouteGuardUsuarioService', () => {
  let service: RouteGuardUsuarioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RouteGuardUsuarioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
