import { TestBed } from '@angular/core/testing';

import { TimelineDrawingService } from './timeline-drawing.service';

describe('DrawingService', () => {
  let service: TimelineDrawingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TimelineDrawingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
