import Timer from '../timer/Timer';
import { IEvent, EventType, EventOrigin } from '../utils/boardInterfaces';
import { AppController } from '../AppController';
import { PlayStates } from './playInterfaces';
import PlayState from './PlayState';
import { ActionType } from '../utils/appInterfaces';

export class PlayController {
  constructor(private app: AppController, private state: PlayState) {
    this.state.log = [];
  }

  public play(): void {
    switch (this.state.state) {
      case PlayStates.PLAY:
        break;
      case PlayStates.PAUSE:
        if (this.state.currIdx === this.state.log.length) {
          this.restart();
        }
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
      case PlayStates.REVERSE:
        this.state.timer.pause();
        break;
      default:
        break;
    }
    this.state.state = PlayStates.PAUSE;
  }

  public reverse(): void {
    switch (this.state.state) {
      case PlayStates.REVERSE:
        break;
      default:
        this.app.dispatchEvent({ eventType: EventType.CLEAR }, EventOrigin.PLAYER);
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

  public restart(): void {
    this.app.dispatchEvent({ eventType: EventType.CLEAR }, EventOrigin.PLAYER);
    this.state.currIdx = 0;
    this.state.timer.restart();
  }

  private playEvents(): void {
    if (this.state.currIdx !== this.state.log.length) {
      setTimeout(() => {
        if (this.state.state === PlayStates.PLAY) {
          this.app.dispatchEvent(this.state.log[this.state.currIdx], EventOrigin.PLAYER);
          this.state.currIdx++;
          this.playEvents();
        }
      }, this.state.log[this.state.currIdx].time! - this.state.timer.getTime());
    } else {
      this.app.dispatchAction({ action: ActionType.PAUSE });
    }
  }

  private reversePlayEvents(): void {
    console.log('playing reverse');
    if (this.state.currIdx >= 0) {
      setTimeout(() => {
        if (this.state.state === PlayStates.REVERSE) {
          this.app.dispatchEvent(this.state.log[this.state.currIdx], EventOrigin.PLAYER);
          this.state.currIdx--;
          this.reversePlayEvents();
        }
      }, this.state.timer.getTime() - this.state.log[this.state.currIdx].time!);
    } else {
      this.app.dispatchAction({ action: ActionType.PAUSE });
    }
  }
}
