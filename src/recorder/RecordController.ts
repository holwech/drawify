import { IAction } from '../action/ActionInterfaces';

export class RecordController {
  private log: IAction[] = [];

  public record(event: IAction): void {
    this.log.push(event);
  }

  public printLog(): void {
    console.log(this.log);
  }

  public getEventLog(): IAction[] {
    this.log = this.log.sort((before: IAction, after: IAction) => {
      return Number(before.time! > after.time!);
    });
    console.log(this.log);
    return this.log;
  }
}
