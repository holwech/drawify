import { RecordObject } from './RecordObject';
import { IRecordPoint, EventType, BoardState } from '../config/interfaces';

export default class RecordLog {
  private numObj: number = -1;
  private objects: RecordObject[] = [];

  public newObject(point: IRecordPoint, event: EventType, boardState: BoardState, startTime: number) {
    this.objects.push(
      new RecordObject(this.newID(), event, boardState, startTime),
    );
    this.objects[this.numObj].addPoint(point);
  }

  public addPoint(point: IRecordPoint) {
    this.objects[this.numObj].addPoint(point);
  }

  public print() {
    console.log(this.objects);
  }

  private newID() {
    this.numObj++;
    return this.numObj;
  }
}
