import { TestBed } from '@angular/core/testing';

import { RelationCodeCollectionService } from './relation-code-collection.service';

describe('RelationCodeCollectionService', () => {
  let service: RelationCodeCollectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RelationCodeCollectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
