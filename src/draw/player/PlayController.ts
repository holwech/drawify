import Timer from '../utils/Timer';
import { DrawController } from '../draw/DrawController';

export class PlayController {
  private timer: Timer;
  private drawController: DrawController;
  private svg: HTMLElement & SVGElement & SVGSVGElement;

  constructor(svgElement: HTMLElement & SVGElement & SVGSVGElement) {
    this.svg = svgElement;
    this.timer = new Timer();
    this.drawController = new DrawController(this.svg);
  }

  public play(): void {
    this.timer.start();
    
  }
}
