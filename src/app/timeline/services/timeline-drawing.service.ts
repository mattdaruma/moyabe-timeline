import { Injectable } from '@angular/core';
import * as dayjs from 'dayjs';
import { TimelineDateGuide } from './timeline-date.service';
import { TimelineDataItem } from './timeline-data.service';

export interface TimelineDrawSettings {
  fillStyle: string,
  timeline: TimelineDrawTimelineSettings
  guides: TimelineDrawGuideSettings
  events: TimelineDrawEventSettings
  center: TimelineDrawCenterSettings
}
export interface TimelineDrawEventSettings {
  height: number,
  fillStyle: string,
  textFillStyle: string,
}
export interface TimelineDrawTimelineSettings {
  strokeStyle: string,
  lineWidth: number
}
export interface TimelineDrawCenterSettings {
  strokeStyle: string,
  fillStyle: string,
  lineWidth: 5
}
export interface TimelineDrawGuideSettings {
  default: TimelineDrawGuideSetting,
  unit: {
    [propName: string]: TimelineDrawGuideSetting
  }
}
export interface TimelineDrawGuideSetting {
  strokeStyle: string,
  lineHeight: number,
  lineWidth: number,
  textAlign: CanvasTextAlign,
  textBaseline: CanvasTextBaseline,
  fontSize: number
  fontFamily: string
  textFillStyle: string
}
export interface TimelineDrawEvent {
  ratio: number,
  span: number,
  icon: string,
  color: string,
  display: string
}

@Injectable({
  providedIn: 'root'
})
export class TimelineDrawingService {
  public canvas = document.createElement('canvas')
  private get halfHeight() { return Math.floor(this.canvas.height / 2) }
  private get halfWidth() { return Math.floor(this.canvas.width / 2) }
  private settings: TimelineDrawSettings = {
    fillStyle: '#FFF',
    timeline: {
      strokeStyle: '#F00',
      lineWidth: 5
    },
    guides: {
      default: {
        strokeStyle: '#0F0',
        lineHeight: 10,
        lineWidth: 5,
        textAlign: 'center',
        textBaseline: 'top',
        fontSize: 16,
        fontFamily: 'px Roboto',
        textFillStyle: '#00F'
      },
      unit: {
        'y': {
          strokeStyle: '#F00',
          lineHeight: 36,
          lineWidth: 12,
          textAlign: 'center',
          textBaseline: 'top',
          fontSize: 36,
          fontFamily: 'px Roboto',
          textFillStyle: '#00F'
        },
        'M': {
          strokeStyle: '#C40',
          lineHeight: 30,
          lineWidth: 10,
          textAlign: 'center',
          textBaseline: 'top',
          fontSize: 30,
          fontFamily: 'px Roboto',
          textFillStyle: '#00F'
        },
        'd': {
          strokeStyle: '#4C0',
          lineHeight: 24,
          lineWidth: 8,
          textAlign: 'center',
          textBaseline: 'top',
          fontSize: 24,
          fontFamily: 'px Roboto',
          textFillStyle: '#00F'
        },
        'h': {
          strokeStyle: '#0C4',
          lineHeight: 18,
          lineWidth: 6,
          textAlign: 'center',
          textBaseline: 'top',
          fontSize: 18,
          fontFamily: 'px Roboto',
          textFillStyle: '#00F'
        },
        'm': {
          strokeStyle: '#04C',
          lineHeight: 12,
          lineWidth: 4,
          textAlign: 'center',
          textBaseline: 'top',
          fontSize: 12,
          fontFamily: 'px Roboto',
          textFillStyle: '#00F'
        },
        's': {
          strokeStyle: '#00F',
          lineHeight: 6,
          lineWidth: 2,
          textAlign: 'center',
          textBaseline: 'top',
          fontSize: 6,
          fontFamily: 'px Roboto',
          textFillStyle: '#00F'
        }
      },
    },
    events: {
      height: 50,
      fillStyle: '#FF0',
      textFillStyle: '#0FF'
    },
    center: {
      strokeStyle: '#606',
      lineWidth: 5,
      fillStyle: 'rgba(255, 255, 255, 0'
    }
  }
  constructor() { }
  private getContext() {
    let context = this.canvas.getContext('2d')!
    context.beginPath()
    return context
  }
  updateSettings(newSettings: TimelineDrawSettings) {
    Object.assign(this.settings, newSettings)
  }
  setDimensions(width: number, height: number) {
    this.canvas.width = width
    this.canvas.height = height
  }
  clearCanvas() {
    let context = this.getContext()
    context.fillStyle = this.settings.fillStyle!
    context.fillRect(0, 0, this.canvas.width, this.canvas.height)
  }
  drawLine() {
    let context = this.getContext()
    context.strokeStyle = this.settings.timeline.strokeStyle
    context.lineWidth = this.settings.timeline.lineWidth
    context.moveTo(0, this.halfHeight)
    context.lineTo(this.canvas.width, this.halfHeight)
    context.stroke()
  }
  drawGuides(guides: TimelineDateGuide[]) {
    let context = this.getContext()
    this.getContext()
    for (let index in guides) {
      let guide = guides[index]
      let x = Math.floor(guide.ratio * this.canvas.width)
      let settings = this.settings.guides.unit[guide.unit]
        ? this.settings.guides.unit[guide.unit]
        : this.settings.guides.default
      context.strokeStyle = settings.strokeStyle
      context.lineWidth = settings.lineWidth
      context.textAlign = settings.textAlign
      context.textBaseline = settings.textBaseline
      context.font = `${settings.fontSize}${settings.fontFamily}`
      context.fillStyle = settings.textFillStyle
      context.moveTo(x, this.halfHeight - settings.lineHeight)
      context.lineTo(x, this.halfHeight + settings.lineHeight)
      context.stroke()
      context.fillText(guide.display, x, this.halfHeight + settings.lineHeight + 5)
    }
  }
  drawEvents(data: TimelineDrawEvent[]) {
    let context = this.getContext()
    for (let index in data) {
      let datum = data[index]
      let xstart = Math.floor(datum.ratio * this.canvas.width)
      let width = Math.floor(datum.span * this.canvas.width)
      context.moveTo(xstart, this.halfHeight - this.settings.events.height)
      context.fillStyle = this.settings.events.fillStyle
      context.fillRect(xstart, this.halfHeight - Math.floor(this.settings.events.height/2),
        width, this.settings.events.height)
    }
  }
  private centerRadius = 20
  drawCenter() {
    let context = this.getContext()
    context.moveTo(this.halfWidth + this.centerRadius, this.halfHeight)
    context.strokeStyle = this.settings.center.strokeStyle
    context.lineWidth = this.settings.center.lineWidth
    context.arc(this.halfWidth, this.halfHeight, this.centerRadius, 0, 2 * Math.PI)
    context.fillStyle = this.settings.center.fillStyle!
    context.fill()
    context.stroke()
  }
}
