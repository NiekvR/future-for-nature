import { TestBed } from '@angular/core/testing';

import { EventInviteCollectionService } from './event-invite-collection.service';

describe('EventInviteCollectionService', () => {
  let service: EventInviteCollectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventInviteCollectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
