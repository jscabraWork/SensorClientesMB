import { TestBed } from '@angular/core/testing';

import { HttpInterceptBasicAuthService } from './http-intercept-basic-auth.service';

describe('HttpInterceptBasicAuthService', () => {
  let service: HttpInterceptBasicAuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HttpInterceptBasicAuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
