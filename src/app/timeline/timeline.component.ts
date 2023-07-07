import { Component, ElementRef, ViewChild } from '@angular/core';
import { TimeLineGuide, TimeLineItem, TimelineService } from './timeline.service';
import { ManipulateType, UnitTypeLong } from 'dayjs';
import { debounceTime, fromEvent } from 'rxjs';
import { DatePipe } from '@angular/common';


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


@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.sass']
})
export class TimelineComponent {
  @ViewChild('timelineCanvas') set content(content: ElementRef<HTMLCanvasElement>) {
    this.canvas = content
    this.context = this.canvas.nativeElement.getContext('2d')
    this.setCanvasSize()
  }
  private canvas: ElementRef<HTMLCanvasElement> | null = null
  private context: CanvasRenderingContext2D | null = null
  get domReady() {
    return this.container && this.canvas && this.context
  }
  get halfWidth() {
    return Math.floor(this.canvas!.nativeElement.width / 2)
  }
  get halfHeight() {
    return Math.floor(this.canvas!.nativeElement.height / 2)
  }
  get intervalCount() {
    return Math.floor(this.canvas!.nativeElement.width / 200)
  }
  @ViewChild('timelineContainer') container: ElementRef | null = null
  private windowResize = fromEvent(window, 'resize').pipe(debounceTime(30))
  private tickInterval: NodeJS.Timer
  private settings: TimeLineSettings = {
    backgroundColor: '#FFF',
    lineColor: '#60A',
    lineWidth: 5,
    guideColor: '#A0A',
    autocenter: true,
    center: new Date(),
    scale: 1,
    scaleUnits: 'day',
    tickTime: 30
  }
  constructor(private timelines: TimelineService, private datePipe: DatePipe) {
    this.onTick()
    this.tickInterval = setInterval(this.onTick, this.settings.tickTime)
  }
  onTick = () => {
    if (!this.domReady) return
    if (this.settings.autocenter) this.settings.center = new Date()
    this.setCanvasSize()
    let guides = this.timelines.getGuides(
      this.settings.center
      , this.settings.scale
      , this.settings.scaleUnits
     )
    this.clearCanvas()
    this.drawLine()
    this.drawGuides(guides)
    this.drawEvents([])
    this.drawCenter()
  }
  setCanvasSize() {
    this.canvas!.nativeElement.width = this.container?.nativeElement.offsetWidth
  }
  clearCanvas() {
    this.context!.fillStyle = this.settings.backgroundColor!
    this.context?.fillRect(0, 0, this.canvas!.nativeElement.width, this.canvas!.nativeElement.height)
  }
  drawLine() {
    this.context?.beginPath()
    this.context!.strokeStyle = this.settings.lineColor
    this.context!.lineWidth = this.settings.lineWidth
    let halfHeight = Math.floor(this.canvas!.nativeElement.height / 2)
    this.context?.moveTo(0, halfHeight)
    this.context?.lineTo(this.canvas!.nativeElement.width, halfHeight)
    this.context?.stroke()
  }
  private centerRadius = 20
  private centerColor = this.settings.backgroundColor
  drawCenter() {
    this.context?.beginPath()
    this.context!.strokeStyle = this.settings.lineColor
    this.context!.lineWidth = this.settings.lineWidth
    this.context?.moveTo(this.halfWidth + this.centerRadius, this.halfHeight)
    this.context?.arc(this.halfWidth, this.halfHeight, this.centerRadius, 0, 2 * Math.PI)
    this.context!.fillStyle = this.centerColor!
    this.context?.fill()
    this.context?.stroke()
  }
  private guideShift = 10
  private guideWidth = 3
  private unitMap: { [propName: string]: number } = {
    'ms': 0,
    's': 1,
    'm': 2,
    'h': 3,
    'd': 4,
    'M': 5,
    'y': 6
  }
  drawGuides(guides: TimeLineGuide[]) {
    guides.sort((ga, gb) => {
      return this.unitMap[ga.unit] < this.unitMap[gb.unit] ? -1 
      : this.unitMap[ga.unit] > this.unitMap[gb.unit] ? 1 : 0
    })
    let width = this.canvas!.nativeElement.width
    this.context!.strokeStyle = this.settings.guideColor
    this.context!.lineWidth = this.guideWidth
    this.context!.textAlign = "center"
    this.context!.textBaseline = "top"
    for (let index in guides) {
      this.context?.beginPath()
      let guide = guides[index]
      let x = Math.floor(guide.ratio * width)
      this.context!.moveTo(x, this.halfHeight - this.guideShift)
      this.context!.lineWidth = 1
      this.context!.font = '16px Roboto'
      this.context!.fillStyle = this.settings.backgroundColor!
      this.context!.lineWidth = this.unitMap[guide.unit]
      let fontSize = this.unitMap[guide.unit]*8
      this.context!.font = `${fontSize}px Roboto`
      this.context?.lineTo(x, this.halfHeight + this.guideShift)
      this.context!.fillStyle = this.settings.guideColor
      this.context?.fillText(guide.display, x, this.halfHeight + this.guideShift)
      this.context?.stroke()
    }
  }
  drawEvents(events: TimeLineItem[]) { }
}
