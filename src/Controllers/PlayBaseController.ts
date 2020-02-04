import { PlayStates } from '../Interfaces/PlayInterfaces';
import PlayState from '../State/PlayState';
import { UserActionType, IUserAction } from '../Interfaces/AppInterfaces';
import Timer from '../Timer/Timer';
import { IAction, Targets } from '../Interfaces/ActionInterfaces';
import { singleton } from 'tsyringe';

@singleton()
export class PlayBaseController {
  private commitAction!: (action: IAction) => void;
  private dispatchUserAction!: (action: IUserAction) => void;

  constructor(private timer: Timer, private state: PlayState) {
    this.state.log = [];
  }

  public Subscribe(callback: (action: IAction) => void) {
    this.commitAction = callback;
    console.log(this.commitAction);
  }

  public SubscribeUserAction(callback: (action: IUserAction) => void) {
    this.dispatchUserAction = callback;
  }

  public setEventLog(log: IAction[]): void {
    this.state.log = log;
  }

  public deleteEventLog(): void {
    this.state.log = [];
  }

  public restart(): void {
    console.log(this.commitAction);
    this.commitAction({ target: Targets.CLEAR });
    this.state.currIdx = 0;
    this.state.log.forEach((action) => {
      if (action.time! === 0) {
        this.playNext();
      }
    });
    this.commitAction({ target: Targets.PREDRAW });
  }

  public playFromIndex(index: number): void {
    this.state.currIdx = index;
    this.playEvents();
  }

  public playFromTime(time: number): void {
    const log = this.state.log;
    if (log.length === 0) {
      return;
    }
    this.commitAction({ target: Targets.CLEAR });
    for (let i = 0; i <= log.length; i++) {
      if (log[i].time! >= time) {
        if (i === 0) {
          this.state.currIdx = 0;
        } else {
          this.state.currIdx = i - 1;
        }
        break;
      }
    }
    console.log('index is ' + this.state.currIdx + ' of ' + log.length);
    this.playEvents();
  }

  protected playNext(): void {
    this.commitAction(this.state.log[this.state.currIdx]);
    this.state.currIdx++;
  }

  protected playEvents(): void {
    if (this.state.currIdx !== this.state.log.length) {
      setTimeout(() => {
        this.playNext();
        this.playEvents();
      }, this.state.log[this.state.currIdx].time! - this.timer.getTime());
    } else {
      this.dispatchUserAction({ action: UserActionType.PAUSE });
    }
  }

  protected reversePlayEvents(): void {
    console.log('playing reverse');
    if (this.state.currIdx >= 0) {
      setTimeout(() => {
        if (this.state.state === PlayStates.REVERSE) {
          this.commitAction(this.state.log[this.state.currIdx]);
          this.state.currIdx--;
          this.reversePlayEvents();
        }
      }, this.timer.getTime() - this.state.log[this.state.currIdx].time!);
    } else {
      this.dispatchUserAction({ action: UserActionType.PAUSE });
    }
  }
}
