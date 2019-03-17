import Timer from '../utils/Timer';
import { IEvent } from '../utils/boardInterfaces';
import { AppController } from '../AppController';

export class PlayController {
  private timer: Timer;
  private log: IEvent[];
  private currIdx = 0;
  private stopPlay = false;
  private app: AppController;

  constructor(app: AppController) {
    this.app = app;
    this.timer = new Timer();
    this.log = [];
  }

  public play(): void {
    this.timer.start();
    this.currIdx = 0;
    this.executeEvent();
  }

  public pause(): void {
    this.timer.pause();
    this.stopPlay = true;
  }

  public stop(): void {
    this.timer.stop();
    this.log = [];
    this.stopPlay = true;
  }

  public setEventLog(log: IEvent[]): void {
    this.log = log;
  }

  private reset(): void {
    this.currIdx = 0;
    this.timer.stop();
  }

  private executeEvent(): void {
    if (this.currIdx === this.log.length) {
      this.reset();
    } else {
      setTimeout(() => {
        if (!this.stopPlay) {
          this.app.dispatchEvent(this.log[this.currIdx]);
          this.currIdx++;
          this.executeEvent();
        }
      }, this.log[this.currIdx].time! - this.timer.getTime());
    }
  }
}
