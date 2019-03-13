import { IEvent, ILogEvent } from '../utils/interfaces';
import RecordLog from './RecordLog';
import Timer from '../utils/Timer';

export class RecordController {
  public recording = false;
  private recordLog: RecordLog;
  private timer: Timer;

  constructor(initialState: IEvent[] = []) {
    this.recordLog = new RecordLog();
    this.timer = new Timer();
    initialState.forEach((event) => {
      this.recordLog.commit(event, this.timer.getTime());
    });
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

  public getLog(): ILogEvent[] {
    return this.recordLog.log;
  }
}
