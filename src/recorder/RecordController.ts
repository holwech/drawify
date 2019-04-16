import { IEvent } from '../utils/boardInterfaces';
import { AppController } from '../AppController';

export class RecordController {
  private log: IEvent[] = [];

  constructor(app: AppController, initialState: IEvent[] = []) {
    initialState.forEach(event => {
      this.record(event);
    });
  }

  public record(event: IEvent): void {
    this.log.push(event);
  }

  public printLog(): void {
    console.log(this.log);
  }

  public getEventLog(): IEvent[] {
    this.log = this.log.sort((before: IEvent, after: IEvent) => {
      return Number(before.time! > after.time!);
    });
    console.log(this.log);
    return this.log;
  }
}
