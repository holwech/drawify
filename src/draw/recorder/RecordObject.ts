import { IRecordPoint, EventType, BoardState } from '../config/interfaces';

export class RecordObject {
  private numPoints: number = 0;
  private path: IRecordPoint[] = [];

  constructor(
    private id: number,
    private event: EventType,
    private boardState: BoardState,
    private startTime: number,
  ) {
  }

  public addPoint(point: IRecordPoint) {
    this.path.push(point);
    this.numPoints++;
  }
}
