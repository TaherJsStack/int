import { TestBed } from '@angular/core/testing';

import { ApiIntgrationService } from './api-intgration.service';

describe('ApiIntgrationService', () => {
  let service: ApiIntgrationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiIntgrationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
