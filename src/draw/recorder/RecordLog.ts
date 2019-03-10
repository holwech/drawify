import { IEvent, ILogEvent } from '../utils/interfaces';

export default class RecordLog {
  public numObj: number = -1;
  public log: ILogEvent[] = [];

  public commit(event: IEvent, time: number): void {
    this.log.push({
      event,
      time,
      id: this.newID(),
    });
  }

  private newID(): number {
    this.numObj++;
    return this.numObj;
  }
}
