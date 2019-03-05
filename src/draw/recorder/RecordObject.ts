import { IRecordPoint, ActionType } from '../interfaces';

export class RecordObject {
  private numPoints: number = 0;
  private path: IRecordPoint[] = [];

  constructor(
    private id: number,
    private type: ActionType,
    private startTime: number,
  ) {
  }

  public addPoint(point: IRecordPoint) {
    this.path.push(point);
    this.numPoints++;
  }
}
