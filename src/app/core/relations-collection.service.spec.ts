import { TestBed } from '@angular/core/testing';

import { RelationsCollectionService } from './relations-collection.service';

describe('RelationsCollectionService', () => {
  let service: RelationsCollectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RelationsCollectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
