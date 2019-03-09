import { RecordObject } from './RecordObject';
import { IRecordPoint, Action, BoardState } from '../interfaces';

export default class RecordLog {
  private numObj: number = -1;
  private objects: RecordObject[] = [];

  public newObject(point: IRecordPoint, action: Action, boardState: BoardState, startTime: number) {
    this.objects.push(
      new RecordObject(this.newID(), action, boardState, startTime),
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
