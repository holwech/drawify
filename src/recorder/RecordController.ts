import { IEvent, ILogEvent } from '../utils/boardInterfaces';
import Timer from '../utils/Timer';
import { AppController } from '../AppController';

export class RecordController {
  private log: IEvent[] = [];

  constructor(app: AppController, initialState: IEvent[] = []) {
    initialState.forEach((event) => {
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
    return this.log;
  }
}
