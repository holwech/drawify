import { PlayStates } from '../Interfaces/PlayInterfaces';
import PlayState from '../State/PlayState';
import { IUserAction } from '../Interfaces/AppInterfaces';
import Timer from '../Timer/Timer';
import { IAction, Targets } from '../Interfaces/ActionInterfaces';
import { singleton } from 'tsyringe';
import Dispatcher from './Dispatcher';

@singleton()
export class PlayBaseController {
  public dispatchUserAction!: (action: IUserAction) => void;

  constructor(private timer: Timer, private state: PlayState, private dispatcher: Dispatcher) {
    this.state.log = [];
  }

  public setEventLog(log: IAction[]): void {
    this.state.log = log;
  }

  public deleteEventLog(): void {
    this.state.log = [];
  }
  
  public play(): void {
    this.playEvents();
  }

  public restart(): void {
    console.log(this.dispatcher.commitAction);
    this.dispatcher.commitAction({ target: Targets.CLEAR });
    this.state.currIdx = 0;
  }

  public predraw(): void {
    for (let action of this.state.log) {
      if (action.time! === 0) {
        this.playNext();
      } else {
        break;
      }
    }
    this.dispatcher.commitAction({ target: Targets.PREDRAW });
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
    this.dispatcher.commitAction({ target: Targets.CLEAR });
    for (let i = 1; i < log.length - 1; i++) {
      if (log[i].time! >= time) {
        this.state.currIdx = i - 1;
        break;
      }
    }
    console.log('index is ' + this.state.currIdx + ' of ' + log.length);
    this.playEvents();
  }

  protected playNext(): void {
    this.dispatcher.commitAction(this.state.log[this.state.currIdx]);
    this.state.currIdx++;
  }

  protected playEvents(): void {
    if (this.state.currIdx < this.state.log.length) {
      setTimeout(() => {
        this.playNext();
        this.playEvents();
      }, this.state.log[this.state.currIdx].time! - this.timer.getTime());
    }
  }

  protected reversePlayEvents(): void {
    console.log('playing reverse');
    setTimeout(() => {
      if (this.state.state === PlayStates.REVERSE) {
        this.dispatcher.commitAction(this.state.log[this.state.currIdx]);
        this.state.currIdx--;
        this.reversePlayEvents();
      }
    }, this.timer.getTime() - this.state.log[this.state.currIdx].time!);
  }
}
