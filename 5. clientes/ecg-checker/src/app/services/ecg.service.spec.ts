import { TestBed } from '@angular/core/testing';

import { EcgService } from './ecg.service';

describe('EcgService', () => {
  let service: EcgService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EcgService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
