import { IRecordPoint, Action, BoardState } from '../interfaces';

export class RecordObject {
  private numPoints: number = 0;
  private path: IRecordPoint[] = [];

  constructor(
    private id: number,
    private action: Action,
    private boardState: BoardState,
    private startTime: number,
  ) {
  }

  public addPoint(point: IRecordPoint) {
    this.path.push(point);
    this.numPoints++;
  }
}
