import { TestBed } from '@angular/core/testing';

import { ScoreCollectionService } from './score-collection.service';

describe('ScoreCollectionService', () => {
  let service: ScoreCollectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScoreCollectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
