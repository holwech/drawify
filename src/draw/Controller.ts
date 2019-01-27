import { SVGDraw } from './SVGDraw';
import { Transform } from './Transform';

export class Controller {
  private svg: HTMLElement;
  private draw: SVGDraw;
  private transform: Transform;
  private fnWheel: (e: WheelEvent) => void;
  private scale = 1;
  private scaleSpeed = 1;

  constructor(svgID: string) {
    this.fnWheel = this.setZoom.bind(this);
    this.draw = new SVGDraw(svgID);
    this.transform = new Transform(svgID);
    this.svg = document.getElementById(svgID) as HTMLElement;
    this.draw.toggleDrawEventListners(true);
  }

  public togglePanMode(toggle: boolean) {
    if (toggle) {
      this.draw.toggleDrawEventListners(false);
      this.transform.togglePanEventListeners(true);
      this.svg.addEventListener('wheel', this.fnWheel);
    } else {
      this.draw.toggleDrawEventListners(true);
      this.transform.togglePanEventListeners(false);
      this.svg.removeEventListener('wheel', this.fnWheel);
    }
  }

  public setZoom(e: WheelEvent) {
    const scale = e.deltaY > 0 ? 1.02 : 0.98;
    // if ((e.deltaY > 0 && this.scale < 1) || (e.deltaY < 0 && this.scale > 1)) {
    //   this.scaleSpeed = scale;
    // }
    e.preventDefault();
    this.transform.scale = scale;
    this.draw.scale = scale;
    this.transform.setZoom(e);
    this.draw.scale *= scale;
    this.scale *= scale;
  }

  public clear() {
    this.draw.clear();
  }

  public setStrokeProperties(color: string, smoothness: string, width: string) {
    this.draw.setStrokeProperties(color, smoothness, width, this.scale);
  }
}
