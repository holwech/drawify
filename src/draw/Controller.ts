import { SVGDraw } from './SVGDraw';
import { Transform } from './Transform';

export class Controller {
  private svg: HTMLElement;
  private draw: SVGDraw;
  private transform: Transform;

  constructor(svgID: string) {
    this.draw = new SVGDraw(svgID);
    this.transform = new Transform(svgID);
    this.svg = document.getElementById(svgID) as HTMLElement;
    this.draw.toggleDrawEventListners(true);
  }

  public togglePanMode(toggle: boolean) {
    if (toggle) {
      this.draw.toggleDrawEventListners(false);
      this.transform.togglePanEventListeners(true);
    } else {
      this.draw.toggleDrawEventListners(true);
      this.transform.togglePanEventListeners(false);
    }
  }

  public clear() {
    this.draw.clear();
  }

  public setStrokeProperties(color: string, smoothness: string, width: string) {
    this.draw.setStrokeProperties(color, smoothness, width);
  }
}
