import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';

export interface TimelineDataItem {
  title: string
  start: Date
  end?: Date
}

@Injectable({
  providedIn: 'root'
})
export class TimelineDataService {
  data: TimelineDataItem[] = []
  constructor() {
  }
}
