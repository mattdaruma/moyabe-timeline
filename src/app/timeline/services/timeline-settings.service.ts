import { Injectable } from '@angular/core';
import { ManipulateType, UnitTypeLong } from 'dayjs';
import { ReplaySubject, Subject } from 'rxjs';

export interface TimeLineSettings {
  backgroundColor?: string,
  lineColor: string,
  lineWidth: number,
  autocenter: boolean,
  guideColor: string,
  center: Date,
  scale: number,
  scaleUnits: ManipulateType & UnitTypeLong,
  tickTime: number
}

@Injectable({
  providedIn: 'root'
})
export class TimelineSettingsService {
  public settings = new ReplaySubject<TimeLineSettings>(1)
  constructor() {
    let settingsString = localStorage.getItem('timeline-settings')
    let settingsCache: TimeLineSettings | null
    if(settingsString) settingsCache = JSON.parse(settingsString) as TimeLineSettings
    else settingsCache = null
    if(settingsCache) this.settings.next(settingsCache)

  }
  updateSettings(settings: TimeLineSettings){
    this.settings.next(settings)
  }
}
