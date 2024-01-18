import { TestBed } from '@angular/core/testing';

import { RegistrationCollectionService } from './registration-collection.service';

describe('RegistrationCollectionService', () => {
  let service: RegistrationCollectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegistrationCollectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
