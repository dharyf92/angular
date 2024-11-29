import { TestBed } from '@angular/core/testing';

import { CanActivateFn } from '@angular/router';
import { isAuthenticated } from './auth.guard';

describe('AuthGuard', () => {
  let guard: CanActivateFn;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(isAuthenticated);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
