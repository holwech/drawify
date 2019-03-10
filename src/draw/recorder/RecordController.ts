import { IEvent } from '../utils/interfaces';
import RecordLog from './RecordLog';
import Timer from './Timer';

export class RecordController {
  private recordLog: RecordLog;
  private timer: Timer;
  private recording = false;

  constructor() {
    this.recordLog = new RecordLog();
    this.timer = new Timer();
  }

  public start(): void {
    this.timer.start();
    this.recording = true;
  }

  public pause(): void {
    this.timer.pause();
    this.recording = true;
  }

  public stop(): void {
    this.timer.stop();
    this.recording = false;
  }

  public dispatch(event: IEvent): void {
    if (this.recording) {
      this.recordLog.commit(event, this.timer.getTime());
    }
  }

  public printLog(): void {
    console.log(this.recordLog.log);
  }
}
