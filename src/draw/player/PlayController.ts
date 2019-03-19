import Timer from '../utils/Timer';
import { IEvent, EventType } from '../utils/boardInterfaces';
import { AppController } from '../AppController';

export class PlayController {
  private timer: Timer;
  private log: IEvent[];
  private currIdx = 0;
  private isPlaying = false;
  private app: AppController;

  constructor(app: AppController) {
    this.app = app;
    this.timer = new Timer();
    this.log = [];
  }

  public play(): void {
    if (!this.isPlaying) {
      this.app.dispatchEvent({ eventType: EventType.CLEAR });
      this.timer.start();
      this.isPlaying = true;
      this.executeEvent();
    }
  }

  public pause(): void {
    this.timer.pause();
    this.isPlaying = false;
  }

  public stop(): void {
    this.timer.stop();
    this.log = [];
    this.isPlaying = false;
  }

  public setEventLog(log: IEvent[]): void {
    this.log = log;
  }

  private reset(): void {
    this.currIdx = 0;
    this.timer.stop();
    this.isPlaying = false;
  }

  private executeEvent(): void {
    if (this.currIdx === this.log.length) {
      this.reset();
    } else {
      setTimeout(() => {
        if (this.isPlaying) {
          this.app.dispatchEvent(this.log[this.currIdx]);
          this.currIdx++;
          this.executeEvent();
        }
      }, this.log[this.currIdx].time! - this.timer.getTime());
    }
  }
}
