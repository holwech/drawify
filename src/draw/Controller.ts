import { SVGDraw } from './SVGDraw';

export class Controller {
  private svg: HTMLElement;
  private draw: SVGDraw;

  constructor(svgID: string) {
    this.draw = new SVGDraw(svgID);
    this.svg = document.getElementById(svgID) as HTMLElement;
    this.draw.toggleDrawEventListners(true);
  }

  public togglePanMode(toggle: boolean) {
    if (toggle) {
      this.draw.toggleDrawEventListners(false);
    } else {
      this.draw.toggleDrawEventListners(true);
    }
  }

  public clear() {
    this.draw.clear();
  }

  public setStrokeProperties(color: string, smoothness: string, width: string) {
    this.draw.setStrokeProperties(color, smoothness, width);
  }

  private togglePanEventListeners(toggle: boolean) {
    if (toggle) {
      // svg.addEventListener('mousedown', onPointerDown); // Pressing the mouse
      // svg.addEventListener('mouseup', onPointerUp); // Releasing the mouse
      // svg.addEventListener('mouseleave', onPointerUp); // Mouse gets out of the SVG area
      // svg.addEventListener('mousemove', onPointerMove); // Mouse is moving

      // // Add all touch events listeners fallback
      // svg.addEventListener('touchstart', onPointerDown); // Finger is touching the screen
      // svg.addEventListener('touchend', onPointerUp); // Finger is no longer touching the screen
      // svg.addEventListener('touchmove', onPointerMove); // Finger is moving
    }
  }

}
