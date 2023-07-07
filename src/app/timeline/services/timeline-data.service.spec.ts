import { TestBed } from '@angular/core/testing';

import { TimelineDataService } from './timeline-data.service';

describe('TimelineService', () => {
  let service: TimelineDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TimelineDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
