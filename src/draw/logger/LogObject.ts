export interface IPoint {
  time: number;
  x: number;
  y: number;
  type: string;
  stringPath: string;
}

export class LogObject {
  private numPoints: number = 0;
  private path: IPoint[] = [];

  constructor(
    private id: number,
    private type: string,
    private startTime: number,
  ) {
  }

  public addPoint(point: IPoint) {
    this.path.push(point);
    this.numPoints++;
  }
}
