import { Injectable } from '@angular/core';
import * as dayjs from 'dayjs';
import { Dayjs, UnitTypeLong } from "dayjs"
import { Subject, min } from 'rxjs';
import { TimeLineSettings } from './timeline.component';


export const GuideUnits: (dayjs.ManipulateType & dayjs.UnitType)[] =
  ['y', 'M', 'd', 'h', 'm', 's', 'ms']

export interface TimeLine {
  data: TimeLineData;
  view: TimeLineView
}
export interface TimeLineData {
  [propName: string]: TimeLineItem;
}
export interface TimeLineItem {
  title: string
  start: Date
  end?: Date
}
export interface TimeLineView {
  guides: Date[]
  data: TimeLineItem[]
}
export interface TimeLineGuide {
  ratio: number,
  display: string,
  date: number,
  unit: string
}

@Injectable({
  providedIn: 'root'
})
export class TimelineService {
  // private settings: TimeLineSettings = {
  //   backgroundColor: '#FFF',
  //   lineColor: '#A0A',
  //   lineWidth: 5,
  //   autocenter: true,
  //   center: dayjs().toDate(),
  //   scale: 1,
  //   scaleUnits: 'day',
  //   tickTime: 1000
  // }
  data: TimeLineData = {}
  //tick = new Subject<TimeLineView>()
  // tickInterval: NodeJS.Timer
  tickTime = 1000
  constructor() {
    // console.warn('Build Service')
    // this.tickInterval = setInterval(()=>{
    //   this.tick.next({
    //     lineColor: this.settings.lineColor,
    //     lineWidth: this.settings.lineWidth,
    //     center: this.settings.autocenter ? dayjs().toDate() : this.settings.center,
    //     min: dayjs().toDate(),
    //     max: dayjs().toDate(),
    //     guides: [],
    //     data: []
    //   })
    // }, this.tickTime)
  }
  private redraw() { }
  getViewData(center: Date, scale: number, units: dayjs.ManipulateType, length: number) {
    let view: TimeLineView = {
      data: [],
      guides: []
    }
    for (let index in this.data) {
      let item = this.data[index]
      view.data.push(item)
    }
    return view
  }

  getGuides(center: Date, scale: number, units: dayjs.ManipulateType & dayjs.UnitType): TimeLineGuide[] {
    let minDate = dayjs(center).subtract(scale, units)
    let maxDate = dayjs(center).add(scale, units)
    let centerDate = dayjs(center)
    let dateSpan = maxDate.diff(minDate)
    let guides: TimeLineGuide[] = []
    for (let unitIndex in GuideUnits) {
      let unit = GuideUnits[unitIndex]
      let unitFound = true
      let startAtEnd = false
      let unitCount = 0
      let looplimit=100
      while (unitFound) {
        startAtEnd = !startAtEnd
        let unitDate: dayjs.Dayjs
        if (startAtEnd) {
          unitDate = centerDate.add(unitCount + 1, unit).startOf(unit)
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
            } as TimeLineGuide
            if (
              guides.length == 0
              || guides[guides.length - 1].unit !== newGuide.unit
              || guides.findIndex(g => Math.abs(g.ratio - newGuide.ratio) < .05) == -1
            ) {
              guides.push(newGuide)
            }
          }
        } else {
          unitFound = false
        }
      }
    }
    // for(let i = 0; i < length; i++){
    //   let lowerYear =minDate.add(1, 'year').startOf('year')
    //   let lower = dayjs(minDate).add(scale*(i+1), units).startOf(units)
    //   let lowerGuide = {
    //     ratio: lower.diff(minDate)/dateSpan,
    //     display: lower.get(units as dayjs.UnitType).toString()
    //   }
    //   guides.push(lowerGuide)
    //   let upper = dayjs(maxDate).add(-scale*(i), units).startOf(units)
    //   let upperGuide = {
    //     ratio: upper.diff(minDate)/dateSpan,
    //     display: upper.get(units as dayjs.UnitType).toString()
    //   }
    //   guides.push(upperGuide)
    // }
    return guides
  }
  // private getViewData(settings: TimeLineSettings){
  //   let viewData = []
  //   for(let dataIndex in this.data){
  //     let data = this.data[dataIndex]
  //     if(dayjs(data.start).isBefore()){
  //     }
  //   }
  // }
  // setCenter(newCenter: Date){
  //   this.settings.center = newCenter
  // }
}
