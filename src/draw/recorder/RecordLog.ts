import { RecordObject } from './RecordObject';
import { IRecordPoint, ActionType } from '../interfaces';

export default class RecordLog {
  private numObj: number = -1;
  private objects: RecordObject[] = [];

  public newObject(point: IRecordPoint, type: ActionType, startTime: number) {
    this.objects.push(
      new RecordObject(this.newID(), type, startTime),
    );
    this.objects[this.numObj].addPoint(point);
    this.numObj++;
  }

  public addPoint(point: IRecordPoint) {
    this.objects[this.numObj].addPoint(point);
  }

  private newID() {
    this.numObj++;
    return this.numObj;
  }
}
