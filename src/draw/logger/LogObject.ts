import { ILogPoint } from '../interfaces';

export class LogObject {
  private numPoints: number = 0;
  private path: ILogPoint[] = [];

  constructor(
    private id: number,
    private type: string,
    private startTime: number,
  ) {
  }

  public addPoint(point: ILogPoint) {
    this.path.push(point);
    this.numPoints++;
  }
}
