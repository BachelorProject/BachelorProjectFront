import { TestBed } from '@angular/core/testing';

import { AuthServiceLocal } from './auth.service';

describe('AuthService', () => {
  let service: AuthServiceLocal;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthServiceLocal);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
