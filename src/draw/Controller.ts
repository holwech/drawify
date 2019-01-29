import { SVGDraw } from './SVGDraw';
import { Transform } from './Transform';

enum BoardState {
  DRAW = 'DRAW',
  PAN = 'PAN',
}

export class Controller {
  // Event listeners
  private fnWheel: (e: WheelEvent) => void;
  private fnOnPointerDown: (e: MouseEvent | TouchEvent) => void;
  private fnOnPointerUp: (e: MouseEvent | TouchEvent) => void;
  private fnOnPointerMove: (e: MouseEvent | TouchEvent) => void;

  // State properties
  private scale = 1;
  private state = BoardState.DRAW;

  private svg: HTMLElement;
  private draw: SVGDraw;
  private transform: Transform;

  constructor(svgID: string) {
    this.draw = new SVGDraw(svgID);
    this.transform = new Transform(svgID);
    this.svg = document.getElementById(svgID) as HTMLElement;

    // Event listeners
    this.fnWheel = this.onWheel.bind(this);
    this.fnOnPointerDown = this.onPointerDown.bind(this);
    this.fnOnPointerUp = this.onPointerUp.bind(this);
    this.fnOnPointerMove = this.onPointerMove.bind(this);

    this.addAllEventListeners();
  }

  public togglePan(toggle: boolean) {
    if (toggle) {
      this.state = BoardState.PAN;
    } else {
      this.state = BoardState.DRAW;
    }
  }

  public clear() {
    this.draw.clear();
  }

  public setStrokeProperties(color: string, smoothness: string, width: string) {
    this.draw.setStrokeProperties(color, smoothness, width, this.scale);
  }

  private addAllEventListeners() {
    this.addPointerEventListeners();
    this.addWheelEventListener();
  }

  private removeAllEventListeners() {
    this.removePointerEventListeners();
    this.removeWheelEventListener();
  }

  private addPointerEventListeners() {
    this.svg.addEventListener('mousedown', this.fnOnPointerDown); // Pressing the mouse
    this.svg.addEventListener('mouseup', this.fnOnPointerUp); // Releasing the mouse
    this.svg.addEventListener('mouseleave', this.fnOnPointerUp); // Mouse gets out of the this.svg area
    this.svg.addEventListener('mousemove', this.fnOnPointerMove); // Mouse is moving

    // this.svg.addEventListener('touchstart', this.fnOnPointerDown); // Finger is touching the screen
    // this.svg.addEventListener('touchend', this.fnOnPointerUp); // Finger is no longer touching the screen
    // this.svg.addEventListener('touchmove', this.fnOnPointerMove); // Finger is moving
  }

  private removePointerEventListeners() {
    this.svg.removeEventListener('mousedown', this.fnOnPointerDown); // Pressing the mouse
    this.svg.removeEventListener('mouseup', this.fnOnPointerUp); // Releasing the mouse
    this.svg.removeEventListener('mouseleave', this.fnOnPointerUp); // Mouse gets out of the this.svg area
    this.svg.removeEventListener('mousemove', this.fnOnPointerMove); // Mouse is moving

    // Add all touch events listeners fallback
    // this.svg.removeEventListener('touchstart', this.fnOnPointerDown); // Finger is touching the screen
    // this.svg.removeEventListener('touchend', this.fnOnPointerUp); // Finger is no longer touching the screen
    // this.svg.removeEventListener('touchmove', this.fnOnPointerMove); // Finger is moving
  }

  private addWheelEventListener() {
    this.svg.addEventListener('wheel', this.fnWheel);
  }

  private removeWheelEventListener() {
    this.svg.removeEventListener('wheel', this.fnWheel);
  }

  private onWheel(e: WheelEvent) {
    if (this.state === BoardState.PAN) {
      const scale = e.deltaY > 0 ? 1.05 : 0.95;
      e.preventDefault();
      this.transform.scale = scale;
      this.draw.scale = scale;
      this.transform.onWheel(e);
      this.draw.scale *= scale;
      this.scale *= scale;
    }
  }

  private onPointerDown(e: TouchEvent | MouseEvent) {
    switch (this.state) {
      case BoardState.DRAW: {
        this.draw.onPointerDown(e);
        break;
      }
      case BoardState.PAN: {
        this.transform.onPointerDown(e);
        break;
      }
      default: {
        throw new Error('No state ' + this.state + ' in onPointerDown');
      }
    }
  }

  private onPointerMove(e: TouchEvent | MouseEvent) {
    switch (this.state) {
      case BoardState.DRAW: {
        this.draw.onPointerMove(e);
        break;
      }
      case BoardState.PAN: {
        this.transform.onPointerMove(e);
        break;
      }
      default: {
        throw new Error('Not state ' + this.state + ' in onPointerMove');
      }
    }
  }

  private onPointerUp() {
    switch (this.state) {
      case BoardState.DRAW: {
        this.draw.onPointerUp();
        break;
      }
      case BoardState.PAN: {
        this.transform.onPointerUp();
        break;
      }
      default: {
        throw new Error('Not state ' + this.state + ' in onPointerUp');
      }
    }
  }
}
