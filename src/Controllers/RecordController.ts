import { IAction, Targets } from '../Interfaces/ActionInterfaces';
import { singleton } from 'tsyringe';

@singleton()
export class RecordController {
  private log: IAction[] = [];
  private buffer: IAction[] = [];

  public record(action: IAction): void {
    if (action.target !== Targets.END) {
      this.buffer.push(action);
    } else {
      this.buffer.forEach(el => {
        this.log.push(el);
      });
      this.log.sort((before: IAction, after: IAction) => {
        return before.time! - after.time!;
      });
      this.flushActionType(action);
      this.log.push(action);
      this.buffer = [];
    }
  }

  public printLog(): void {
    console.log(this.log);
  }

  public getEventLog(): IAction[] {
    return this.log;
  }

  public filterLogById(id: number): void {
    this.log.filter((el) => el.id !== id);
  }

  private flushActionType(action: IAction): void {
    if (action.time! > this.log[this.log.length - 1].time!) {
      this.log = this.log.filter(el => el.target !== Targets.END);
    }
  }
}
