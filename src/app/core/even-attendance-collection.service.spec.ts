import { TestBed } from '@angular/core/testing';

import { EvenAttendanceCollectionService } from './even-attendance-collection.service';

describe('EvenAttendanceCollectionService', () => {
  let service: EvenAttendanceCollectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EvenAttendanceCollectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
