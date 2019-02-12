import { SVGDraw } from './SVGDraw';
import { Transform } from './Transform';
import { IStrokeStyle, IPoint } from './interfaces';

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
  private strokeStyle: IStrokeStyle;

  private svg: HTMLElement & SVGElement & SVGSVGElement;
  private draw: SVGDraw;
  private transform: Transform;

  constructor(svgID: string, style: IStrokeStyle) {
    this.draw = new SVGDraw(svgID);
    this.transform = new Transform(svgID);
    this.svg = document.getElementById(svgID) as any as HTMLElement & SVGElement & SVGSVGElement;
    this.strokeStyle = style;

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

  public setStrokeProperties(color: string, smoothness: number, width: number) {
    this.strokeStyle.bufferSize = smoothness;
    this.strokeStyle.color = color;
    this.strokeStyle.width = width * this.scale;
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
    e.preventDefault();
    if (this.state === BoardState.PAN) {
      const scale = e.deltaY > 0 ? 1.05 : 0.95;
      this.strokeStyle.width = this.strokeStyle.width * scale;
      const point = this.getPointerPosition(e);
      this.transform.onWheel(point, scale);
      this.scale *= scale;
    }
  }

  private onPointerDown(e: TouchEvent | MouseEvent) {
    e.preventDefault();
    const point = this.getPointerPosition(e);
    switch (this.state) {
      case BoardState.DRAW: {
        this.draw.onPointerDown(point, this.strokeStyle);
        break;
      }
      case BoardState.PAN: {
        this.transform.onPointerDown(point);
        break;
      }
      default: {
        throw new Error('No state ' + this.state + ' in onPointerDown');
      }
    }
  }

  private onPointerMove(e: TouchEvent | MouseEvent) {
    e.preventDefault();
    const point = this.getPointerPosition(e);
    switch (this.state) {
      case BoardState.DRAW: {
        this.draw.onPointerMove(point, this.strokeStyle.bufferSize);
        break;
      }
      case BoardState.PAN: {
        this.transform.onPointerMove(point, this.scale);
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

  private getPointerPosition(e: TouchEvent | MouseEvent | WheelEvent): IPoint {
    const m = this.svg.getScreenCTM();
    let svgPoint = this.svg.createSVGPoint();
    if ((window as any).TouchEvent && e instanceof TouchEvent) {
      svgPoint.x = e.targetTouches[0].clientX;
      svgPoint.y = e.targetTouches[0].clientY;
    } else if (e instanceof MouseEvent || e instanceof WheelEvent) {
      svgPoint.x = e.clientX;
      svgPoint.y = e.clientY;
    }
    if (m) {
      svgPoint = svgPoint.matrixTransform(m.inverse());
      return {
        x: svgPoint.x,
        y: svgPoint.y,
        dm: svgPoint,
      };
    } else {
      throw new Error('m variable is not defined in getPointFromViewBox in Transform');
    }
  }
}
