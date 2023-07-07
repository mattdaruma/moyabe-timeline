import { TestBed } from '@angular/core/testing';

import { TimelineSettingsService } from './timeline-settings.service';

describe('SettingsService', () => {
  let service: TimelineSettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TimelineSettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
