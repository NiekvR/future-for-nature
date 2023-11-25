import { TestBed } from '@angular/core/testing';

import { EventCollectionService } from './event-collection.service';

describe('EventCollectionService', () => {
  let service: EventCollectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventCollectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
