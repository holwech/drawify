import { ILogPoint } from '../interfaces';
import Log from './Log';
import Timer from './Timer';

export class Logger {
  private log: Log;
  private startTime = 0;
  private timer: Timer;

  constructor() {
    this.log = new Log();
    this.timer = new Timer();
  }

  private start() {
    this.timer.start();
  }

  private stop() {
    this.timer.stop();
  }

  private pause() {
    this.timer.pause();
  }

  // private onPointerDown(e: TouchEvent | MouseEvent) {

  //   this.log.addObject()
  // }

  // private createPoint(e: TouchEvent | MouseEvent): IPoint {
  //   return {
  //     time: this.log.getStartTime,
  //     e.
  //   }
  // }

  // private newObject(startPoint: {type: string, x: number, y: number}) {
  //   const startTime = new Date().getTime();

  //   this.log.objects.push({
  //     startTime,
  //     numPoints: 1,
  //     points: [{
  //         point: {type: startPoint.type, x: startPoint.x, y: startPoint.y},
  //         stringPoint: startPoint.type + startPoint.x + ' ' + startPoint.y,
  //         numPoints: 1,
  //         time: startTime,
  //     }],
  //   });
  // }

  // private addPoint() {
  //   this.log.objects.points[].push({
  //   })
  // }
}
