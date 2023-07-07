import { Component, ElementRef, ViewChild } from '@angular/core';
import { TimelineDataService } from './services/timeline-data.service';
import { TimelineDrawingService } from './services/timeline-drawing.service';
import { TimeLineSettings, TimelineSettingsService } from './services/timeline-settings.service';
import { TimelineDateService } from './services/timeline-date.service';
import * as dayjs from 'dayjs';

export interface TimelineComponentSettings {
  tickTime: number
  refreshTime: number
  autoCenter: boolean
}


@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.sass']
})
export class TimelineComponent {
  settings: TimelineComponentSettings = {
    tickTime: 900,
    refreshTime: 4900,
    autoCenter: true
  }

  @ViewChild('timelineCanvas') set content(content: ElementRef<HTMLCanvasElement>) {
    this.canvas = content.nativeElement
    this.setCanvasSize()
  }
  private canvas: HTMLCanvasElement | null = null
  get domReady() {
    return this.container && this.canvas
  }
  @ViewChild('timelineContainer') container: ElementRef | null = null
  //private windowResize = fromEvent(window, 'resize').pipe(debounceTime(30))
  private tickInterval: NodeJS.Timer | null = null
  constructor(
    private data: TimelineDataService, 
    private draw: TimelineDrawingService,
    private date: TimelineDateService
    ) {
      this.tickInterval = setInterval(() => { this.onTick() }, this.settings.tickTime)
  }
  onTick = () => {
    if (!this.domReady) return
    if(this.settings.autoCenter) this.date.recenter(new Date())
    this.setCanvasSize()
    let guides = this.date.getGuidesInRange()
    let events = this.date.getEvents(this.data.data)
    this.draw.clearCanvas()
    this.draw.drawLine()
    this.draw.drawGuides(guides)
    this.draw.drawEvents(events)
    this.draw.drawCenter()
    this.canvas!.getContext('2d')!.drawImage(this.draw.canvas, 0, 0)
  }
  setCanvasSize() {
    this.canvas!.width = this.container?.nativeElement.offsetWidth
    this.draw.setDimensions(this.canvas!.width, this.canvas!.height)
  }
}