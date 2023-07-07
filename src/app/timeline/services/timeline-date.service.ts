import { Injectable } from '@angular/core';
import * as dayjs from 'dayjs';
import { TimelineDataItem } from './timeline-data.service';
import { TimelineDrawEvent } from './timeline-drawing.service';

export interface TimelineDateGuide {
  ratio: number,
  display: string,
  date: number,
  unit: dayjs.ManipulateType & (dayjs.UnitTypeLong | dayjs.UnitTypeLongPlural | dayjs.UnitTypeShort)
}

export interface TimelineDateSettings{
  units: (dayjs.ManipulateType & dayjs.UnitType)[],
  ratioDifference: number
  center: Date
  scale: number
  unit: dayjs.ManipulateType & (dayjs.UnitTypeLong | dayjs.UnitTypeLongPlural | dayjs.UnitTypeShort)
}

export interface TimelineComponentSettings {
  tickTime: number
  refreshTime: number
}
@Injectable({
  providedIn: 'root'
})
export class TimelineDateService {
  private settings: TimelineDateSettings = {
    center: new Date(),
    units: ['y', 'M', 'd', 'h', 'm', 's'],
    ratioDifference: .05,
    scale: 1,
    unit: 'm',
  }
  private get minDate(): dayjs.Dayjs{
    return dayjs(this.settings.center).add(-this.settings.scale, this.settings.unit)
  }
  private get maxDate(): dayjs.Dayjs{
    return dayjs(this.settings.center).add(this.settings.scale, this.settings.unit)
  }
  private get dateSpan(): number{
    return this.maxDate.diff(this.minDate)
  }
  constructor() { }
  recenter(newCenter: Date){
    this.settings.center = newCenter
  }
  updateSettings(newSettings: TimelineDateSettings){
    Object.assign(this.settings, newSettings)
  }
  getGuidesInRange(){
    let minDate = dayjs(this.settings.center).subtract(this.settings.scale, this.settings.unit)
    let maxDate = dayjs(this.settings.center).add(this.settings.scale, this.settings.unit)
    let centerDate = dayjs(this.settings.center)
    let dateSpan = maxDate.diff(minDate)
    let guides: TimelineDateGuide[] = []
    for (let unitIndex in this.settings.units) {
      let unit = this.settings.units[unitIndex]
      let unitFound = true
      let startAtEnd = false
      let unitCount = 0
      let looplimit=100
      while (unitFound) {
        startAtEnd = !startAtEnd
        let unitDate: dayjs.Dayjs
        if (startAtEnd) {
          unitDate = centerDate.add(unitCount, unit).startOf(unit)
        } else {
          unitDate = centerDate.subtract(unitCount, unit).startOf(unit)
          unitCount++
          if(unitCount > looplimit){
            unitFound = false
          }
        }
        let guideIndex = guides.findIndex(g => {
          return unitDate.toDate().getTime() == g.date
        })
        if (
          unitDate.isBefore(maxDate)
          && unitDate.isAfter(minDate)
        ) {
          if (guideIndex == -1) {
            let newGuide = {
              ratio: Math.floor((unitDate.diff(minDate) / dateSpan)*100)/100,
              display: unitDate.format(unit) + ` ${unit}`,
              unit: unit,
              date: unitDate.toDate().getTime()
            } as TimelineDateGuide
            if (
              guides.length == 0
              || guides.findIndex(g => Math.abs(g.ratio - newGuide.ratio) < this.settings.ratioDifference) == -1
            ) {
              guides.push(newGuide)
            }
          }
        } else {
          unitFound = false
        }
      }
    }
    guides.sort((ga, gb) => {
      return this.settings.units.indexOf(ga.unit) < this.settings.units.indexOf(gb.unit) ? 1
        : this.settings.units.indexOf(ga.unit) > this.settings.units.indexOf(gb.unit) ? -1 : 0
    })
    return guides
  }
  getEvents(
    data: TimelineDataItem[]
    ): TimelineDrawEvent[]{
      let futureStart = dayjs().add(10, 's')
      let futureStop = futureStart.add(10, 's')
      let eventSpan = futureStop.diff(futureStart)
    return [{
      ratio: futureStart.diff(this.minDate)/ this.dateSpan,
      span: eventSpan / this.dateSpan,
      display: 'hehe',
      color: '#f00',
      icon: 'smile'
    }]
  }
  getAlerts(){}
}
