import { TestBed } from '@angular/core/testing';

import { ApplicationCollectionService } from './application-collection.service';

describe('ApplicationCollectionService', () => {
  let service: ApplicationCollectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApplicationCollectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
