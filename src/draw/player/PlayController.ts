import Timer from '../utils/Timer';
import { IEvent, EventType } from '../utils/boardInterfaces';
import { AppController } from '../AppController';
import { PlayStates } from './playInterfaces';
import PlayState from './PlayState';

export class PlayController {
  private app: AppController;
  private state: PlayState;

  constructor(app: AppController, state: PlayState) {
    this.app = app;
    this.state = state;
    this.state.timer = new Timer();
    this.state.log = [];
  }

  public play(): void {
    switch (this.state.state) {
      case PlayStates.PLAY:
        break;
      case PlayStates.PAUSE:
        this.state.timer.start();
        this.state.state = PlayStates.PLAY;
        this.playEvents();
        break;
      case PlayStates.STOP:
        this.reset();
        this.state.timer.start();
        this.state.state = PlayStates.PLAY;
        this.playEvents();
        break;
      case PlayStates.REVERSE:
        this.state.timer.start();
        this.state.state = PlayStates.PLAY;
        this.playEvents();
        break;
      default:
        break;
    }
    this.state.state = PlayStates.PLAY;
  }

  public pause(): void {
    switch (this.state.state) {
      case PlayStates.PLAY:
        this.state.timer.pause();
        break;
      case PlayStates.PAUSE:
        break;
      case PlayStates.STOP:
        this.state.timer.pause();
        break;
      case PlayStates.REVERSE:
        this.state.timer.pause();
        break;
      default:
        break;
    }
    this.state.state = PlayStates.PAUSE;
  }

  public stop(): void {
    switch (this.state.state) {
      case PlayStates.PLAY:
        this.state.timer.stop();
        break;
      case PlayStates.PAUSE:
        this.state.timer.stop();
        break;
      case PlayStates.STOP:
        break;
      default:
        break;
    }
    this.state.state = PlayStates.STOP;
  }

  public reverse(): void {
    switch (this.state.state) {
      case PlayStates.REVERSE:
        break;
      default:
        this.app.dispatchEvent({ eventType: EventType.CLEAR });
        this.state.state = PlayStates.REVERSE;
        this.state.timer.reverse();
        this.reversePlayEvents();
        break;
    }
  }

  public setEventLog(log: IEvent[]): void {
    this.state.log = log;
  }

  public deleteEventLog(): void {
    this.state.log = [];
  }

  private reset(): void {
    this.app.dispatchEvent({ eventType: EventType.CLEAR });
    this.state.currIdx = 0;
    this.state.timer.stop();
  }

  private playEvents(): void {
    if (this.state.currIdx !== this.state.log.length) {
      setTimeout(() => {
        if (this.state.state === PlayStates.PLAY) {
          this.app.dispatchEvent(this.state.log[this.state.currIdx]);
          this.state.currIdx++;
          this.playEvents();
        }
      }, this.state.log[this.state.currIdx].time! - this.state.timer.getTime());
    } else {
      this.stop();
    }
  }

  private reversePlayEvents(): void {
    console.log('playing reverse');
    if (this.state.currIdx >= 0) {
      setTimeout(() => {
        if (this.state.state === PlayStates.REVERSE) {
          this.app.dispatchEvent(this.state.log[this.state.currIdx]);
          this.state.currIdx--;
          this.reversePlayEvents();
        }
      }, this.state.timer.getTime() - this.state.log[this.state.currIdx].time!);
    } else {
      this.stop();
    }
  }
}
