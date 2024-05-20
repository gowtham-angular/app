import { TestBed } from '@angular/core/testing';

import { FireUserService } from './fire-user.service';

describe('FireUserService', () => {
  let service: FireUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FireUserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
