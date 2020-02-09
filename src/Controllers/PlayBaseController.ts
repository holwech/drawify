import { PlayStates } from '../Interfaces/PlayInterfaces';
import PlayState from '../State/PlayState';
import { IUserAction } from '../Interfaces/AppInterfaces';
import Timer from '../Timer/Timer';
import { IAction, Targets } from '../Interfaces/ActionInterfaces';
import { singleton } from 'tsyringe';
import Dispatcher from './Dispatcher';

@singleton()
export class PlayBaseController {
  private continuePlaying: boolean = false;

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
    this.continuePlaying = true;
    this.playEvents();
  }

  public pause(): void {
    this.continuePlaying = false;
  }

  public restart(): void {
    this.continuePlaying = false;
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
    this.continuePlaying = true;
    this.state.currIdx = index;
    this.playEvents();
  }

  public playFromTime(time: number): void {
    this.continuePlaying = true;
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
    //console.log('index is ' + this.state.currIdx + ' of ' + log.length);
    this.playEvents();
  }

  protected playNext(): void {
    this.dispatcher.commitAction(this.state.log[this.state.currIdx]);
    this.state.currIdx++;
  }

  protected playEvents(): void {
    if (this.state.currIdx < this.state.log.length) {
      setTimeout(() => {
        if (this.continuePlaying) {
          this.playNext();
          this.playEvents();
        }
      }, this.state.log[this.state.currIdx].time! - this.timer.getTime());
    }
  }
}
