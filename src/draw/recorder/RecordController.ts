import { IRecordPoint, IPoint, ActionType } from '../interfaces';
import RecordLog from './RecordLog';
import Timer from './Timer';

export class RecordController {
  private recordLog: RecordLog;
  private timer: Timer;

  constructor() {
    this.recordLog = new RecordLog();
  }

  public start() {
    this.timer.start();
  }

  public pause() {
    this.timer.pause();
  }

  public stop() {
    this.timer.stop();
  }

  public action(point: IPoint, type: ActionType) {

  }

  private newObject(point: IPoint, type: ActionType) {
    const time = this.timer.getTime();
    this.recordLog.newObject(
      { time, ...point},
      type,
      time,
    );
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
