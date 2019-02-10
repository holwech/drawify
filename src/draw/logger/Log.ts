import { LogObject, IPoint } from './LogObject';

export default class Log {
  private numObj: number = 0;
  private objects: LogObject[] = [];

  constructor(
    private startTime: number,
  ) { }

  get getStartTime() {
    return this.startTime;
  }

  public addObject(point: IPoint, objectType: string, startTime: number) {
    this.objects.push(
      new LogObject(
        this.numObj,
        objectType,
        startTime,
      ),
    );
    this.objects[this.numObj].addPoint(point);
    this.numObj++;
  }

  public addPoint(point: IPoint) {
    this.objects[this.numObj - 1].addPoint(point);
  }
}
