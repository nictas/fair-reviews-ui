import { TestBed } from '@angular/core/testing';

import { MultipliersService } from './multipliers.service';

describe('MultipliersService', () => {
  let service: MultipliersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MultipliersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
