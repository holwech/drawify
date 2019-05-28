import Timer from '../timer/Timer';
import { EventOrigin } from '../utils/boardInterfaces';
import { EventType } from '../utils/appInterfaces';
import { AppController } from '../AppController';
import { PlayStates } from './playInterfaces';
import PlayState from './PlayState';
import { UserActionType } from '../utils/appInterfaces';
import { IAction } from '../event/eventInterfaces';

export class PlayController {
  constructor(private app: AppController, private timer: Timer, private state: PlayState) {
    this.state.log = [];
  }

  public start(): void {
    switch (this.state.state) {
      case PlayStates.PLAY:
        break;
      case PlayStates.PAUSE:
        console.log('hello');
        this.timer.start();
        this.state.state = PlayStates.PLAY;
        this.playEvents();
        break;
      case PlayStates.REVERSE:
        this.timer.start();
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
        this.timer.pause();
        break;
      case PlayStates.PAUSE:
        break;
      case PlayStates.REVERSE:
        this.timer.pause();
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
        this.app.event.dispatch({ eventType: EventType.CLEAR }, EventOrigin.PLAYER);
        this.state.state = PlayStates.REVERSE;
        this.timer.reverse();
        this.reversePlayEvents();
        break;
    }
  }

  public setEventLog(log: IAction[]): void {
    this.state.log = log;
  }

  public deleteEventLog(): void {
    this.state.log = [];
  }

  public restart(): void {
    this.app.event.dispatch({ eventType: EventType.CLEAR }, EventOrigin.PLAYER);
    this.state.currIdx = 0;
    this.timer.restart();
  }

  private playEvents(): void {
    if (this.state.currIdx !== this.state.log.length) {
      setTimeout(() => {
        if (this.state.state === PlayStates.PLAY) {
          this.app.event.dispatchAction(this.state.log[this.state.currIdx]);
          this.state.currIdx++;
          this.playEvents();
        }
      }, this.state.log[this.state.currIdx].time! - this.timer.getTime());
    } else {
      this.app.dispatchUserAction({ action: UserActionType.PAUSE });
    }
  }

  private reversePlayEvents(): void {
    console.log('playing reverse');
    if (this.state.currIdx >= 0) {
      setTimeout(() => {
        if (this.state.state === PlayStates.REVERSE) {
          this.app.event.dispatchAction(this.state.log[this.state.currIdx]);
          this.state.currIdx--;
          this.reversePlayEvents();
        }
      }, this.timer.getTime() - this.state.log[this.state.currIdx].time!);
    } else {
      this.app.dispatchUserAction({ action: UserActionType.PAUSE });
    }
  }
}
