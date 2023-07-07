import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';

const timeline = {
  "1688410666380": {
    titl: 'first thing'
  },
  "1688410666381": {
    title: 'second thing'
  },
  "1688410666382-1688410666384": {
    title: "Doing stuff"
  },
}

const intervals = [
  1,
  1000,
  60000,
  3600000,
  86400000,
  31449600000
]

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
  animations: [
    trigger('fade', [
      state('in', style({opacity: 1})),
      state('out', style({opacity: 0})),
      transition('out => in', [
        animate(100, style({ opacity: 1 }))
      ]),
      transition('in => out', [
        animate(100, style({ opacity: 0 }))
      ])
    ])
  ]
})
export class AppComponent {
  title = 'moyabe-timeline';
//   settings = {
//     center: Date.now(),
//     scale: 7200000,
//     color: '#606'
//   }
//   get halfWidth(): number {
//     return Math.round(this.canvas!.nativeElement.width / 2)
//   }
//   get halfHeight(): number {
//     return Math.round(this.canvas!.nativeElement.height / 2)
//   }
//   now = Date.now()
//   canvas: ElementRef<HTMLCanvasElement> | null = null
//   context: CanvasRenderingContext2D | null = null
//   @ViewChild('timelineCanvas') set content(content: ElementRef<HTMLCanvasElement>){
//     this.canvas = content
//     this.context = this.canvas.nativeElement.getContext('2d')
//   }
//   @ViewChild('timelineContainer') container: ElementRef | null = null
//   private windowResizing = false
//   private windowResize = fromEvent(window, 'resize')
//   private windowResizeComplete = this.windowResize.pipe(debounceTime(100))
//   constructor(private datePipe: DatePipe, private timeline: TimelineService) { 
//     this.windowResize.subscribe(e => {
//       if(!this.windowResizing){
//         this.windowResizing = true
//       }
//     })
//     this.windowResizeComplete.subscribe(e => {
//       this.windowResizing = false
//     })
//     setInterval(()=>{
//       this.now = Date.now()
//       this.drawCanvas()
//     }, 300)
//  }
//  getInterval(scale:number){
//   for(let i in intervals){
//     if(scale <= intervals[i]) return {index: parseInt(i) - 1, interval: intervals[parseInt(i) - 1]}
//   }
//   return {index: intervals.length - 1, interval: intervals[intervals.length - 1]}
//  }
//   drawCanvas(){
//     this.canvas!.nativeElement.width = this.container?.nativeElement.offsetWidth
//     this.canvas!.nativeElement.height = 100
//     this.context?.clearRect(0, 0, this.canvas!.nativeElement.width, this.canvas!.nativeElement.height)
//     this.drawCenterLine()
//     this.drawIntervals()
//     this.context?.stroke()
//   }
//   drawCenterLine(){
//     this.context!.strokeStyle = this.settings.color
//     this.context!.moveTo(0, 20)
//     this.context!.lineTo(window.innerWidth, 20)
//     this.context?.moveTo(this.halfWidth, 0)
//     this.context?.lineTo(this.halfWidth, 40)
//     let minTime = new Date(this.now - this.settings.scale)
//     let maxTime = new Date(this.now + this.settings.scale)
//     let halfTime = minTime.getTime() + Math.floor((maxTime.getTime() - minTime.getTime()) / 2)
//     this.context!.textAlign = "center"
//     this.context!.textBaseline = "top"
//     this.context!.fillStyle="#000"
//     this.context?.fillText(`${this.datePipe.transform(halfTime, 'long')}`, this.halfWidth, 0)
//   }
//   drawIntervals(){
//     let minTime = new Date(this.now - this.settings.scale)
//     let maxTime = new Date(this.now + this.settings.scale)
//     let interval = this.getInterval(this.settings.scale)
//     let span = maxTime.getTime() - minTime.getTime()
//     let firstInterval = minTime.getTime() + interval.interval - (minTime.getTime()%interval.interval)
//     let remainingSpan = maxTime.getTime() - firstInterval
//     let intervalCount = Math.floor(remainingSpan / interval.interval)
//     let intervalMultiplier = 1
//     while(intervalCount > 8){
//       intervalCount = Math.floor(intervalCount / 2)
//       intervalMultiplier = intervalMultiplier * 2
//     }
//     for(let i = 0; i <= intervalCount; i++){
//       let currentInterval = firstInterval + (interval.interval * i * intervalMultiplier)
//       let distance = currentInterval - minTime.getTime()
//       let ratio = distance/span
//       let xcoord = Math.round(this.canvas!.nativeElement.width * ratio)
//       this.context?.moveTo(xcoord, 18)
//       this.context?.lineTo(xcoord, 22)
//       this.context!.textAlign = "center"
//       this.context!.textBaseline = "top"
//       this.context!.fillStyle="#000"
//       switch(interval.index){
//         case 0: 
//           this.context?.fillText(`${(new Date(currentInterval)).getMilliseconds()}ms`, xcoord, 25)
//           break;
//         case 1: 
//           this.context?.fillText(`${(new Date(currentInterval)).getSeconds()}s`, xcoord, 25)
//           break;
//         case 2: 
//           this.context?.fillText(`${(new Date(currentInterval)).getMinutes()}m`, xcoord, 25)
//           break;
//         case 3: 
//           this.context?.fillText(`${(new Date(currentInterval)).getHours()}h`, xcoord, 25)
//           break;
//         case 4: 
//           this.context?.fillText(`${(new Date(currentInterval)).getDate()+1}`, xcoord, 25)
//           break;
//         case 5: 
//           this.context?.fillText(`${(new Date(currentInterval)).getFullYear()}`, xcoord, 25)
//           break;
//         default: 
//           this.context?.fillText(`${this.datePipe.transform(currentInterval, 'long')}`, xcoord, 25)
//           break;
//       }
//     }
//   }
}
