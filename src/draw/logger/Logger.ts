import { IPoint } from './LogObject';
import Log from './Log';

export class Logger {
  private log: Log;

  constructor() {
    this.log = new Log(new Date().getTime());
  }

  private onPointerDown(e: TouchEvent | MouseEvent) {

    this.log.addObject()
  }

  private createPoint(e: TouchEvent | MouseEvent): IPoint {
    return {
      time: this.log.getStartTime,
      e.
    }
  }

  private newObject(startPoint: {type: string, x: number, y: number}) {
    const startTime = new Date().getTime();
    

    this.log.objects.push({
      startTime,
      numPoints: 1,
      points: [{
          point: {type: startPoint.type, x: startPoint.x, y: startPoint.y},
          stringPoint: startPoint.type + startPoint.x + ' ' + startPoint.y,
          numPoints: 1,
          time: startTime,
      }],
    });
  }

  private addPoint() {
    this.log.objects.points[].push({
      
    })
  }
}