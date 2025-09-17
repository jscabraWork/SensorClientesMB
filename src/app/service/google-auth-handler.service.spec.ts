import { TestBed } from '@angular/core/testing';

import { GoogleAuthHandlerService } from './google-auth-handler.service';

describe('GoogleAuthHandlerServiceService', () => {
  let service: GoogleAuthHandlerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GoogleAuthHandlerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
