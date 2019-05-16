import { IEvent } from '../utils/boardInterfaces';

export class RecordController {
  private log: IEvent[] = [];

  constructor(initialState: IEvent[] = []) {
    initialState.forEach(event => {
      this.record(event);
    });
  }

  public record(event: IEvent): void {
    if (event.isEdit) {
      console.log('is edit');
    }
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
