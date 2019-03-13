import Timer from '../utils/Timer';
import { DrawController } from '../draw/DrawController';
import { IEvent, ILogEvent, EventType } from '../utils/interfaces';

export class PlayController {
  private timer: Timer;
  private drawController: DrawController;
  private svg: HTMLElement & SVGElement & SVGSVGElement;
  private log: ILogEvent[];
  private currIdx = 0;
  private stop = false;

  constructor(svgElement: HTMLElement & SVGElement & SVGSVGElement, log: ILogEvent[]) {
    this.svg = svgElement;
    this.timer = new Timer();
    this.drawController = new DrawController(this.svg);
    this.log = log;
  }

  public play(): void {
    this.timer.start();
    this.executeEvent();
  }

  private executeEvent(): void {
    setTimeout(() => {
      if (!this.stop) {
        this.drawController.execute(this.log[this.currIdx].event);
        this.currIdx++;
        this.executeEvent();
      }
    }, this.log[this.currIdx].time - this.timer.getTime());
  }
}
