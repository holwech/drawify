import { SVGDraw } from './SVGDraw';
import { Transform } from './Transform';
import { RecordController } from './recorder/RecordController';
import { IStrokeStyle, IViewBox, BoardState } from './interfaces';


const SCALE_FACTOR = 0.05;

export class Controller {
  // Event listeners
  private fnWheel: (e: WheelEvent) => void;
  private fnOnPointerDown: (e: MouseEvent) => void;
  private fnOnPointerUp: (e: MouseEvent) => void;
  private fnOnPointerMove: (e: MouseEvent) => void;

  // State properties
  private scale = 1;
  private state = BoardState.DRAW;
  private strokeStyle: IStrokeStyle;
  private viewBox: IViewBox;

  private svg: HTMLElement & SVGElement & SVGSVGElement;
  private draw: SVGDraw;
  private transform: Transform;
  private recordLog: RecordController;
  private recording = false;

  constructor(svgID: string, style: IStrokeStyle) {
    this.svg = document.getElementById(svgID) as any as HTMLElement & SVGElement & SVGSVGElement;
    this.draw = new SVGDraw(this.svg);
    this.transform = new Transform(this.svg);
    this.strokeStyle = style;

    if (!this.svg.getScreenCTM()) {
      throw new Error('m variable is not defined in getPointFromViewBox in Transform');
    }

    const viewboxElem = this.svg.getAttributeNS(null, 'viewBox');
    if (viewboxElem !== null) {
      const arr = viewboxElem.split(' ').map(Number);
      this.viewBox = { x: arr[0], y: arr[1], width: arr[2], height: arr[3] };
    } else {
      throw new Error('The SVG element requires the view box attribute to be set.');
    }

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

  public startRecording() {
    this.recordLog.start();
    this.recording = true;
  }

  public pauseRecording() {
    this.recordLog.pause();
    this.recording = true;
  }

  public stopRecording() {
    this.recordLog.stop();
    this.recording = false;
  }

  private recordEvent() {
    if(this.recording) {

    }
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
      const scale = e.deltaY > 0 ? 1 + SCALE_FACTOR : 1 - SCALE_FACTOR;
      this.strokeStyle.width = this.strokeStyle.width * scale;
      const point = this.getPointerPosition(e);
      this.transform.onWheel(point, this.viewBox, scale);
      this.scale *= scale;
    }
  }

  private onPointerDown(e: MouseEvent) {
    e.preventDefault();
    const point = this.getPointerPosition(e);
    switch (this.state) {
      case BoardState.DRAW:
        this.draw.onPointerDown(point, this.strokeStyle);
        break;
      case BoardState.PAN:
        this.transform.onPointerDown(point);
        break;
      default:
        throw new Error('No state ' + this.state + ' in onPointerDown');
    }
  }

  private onPointerMove(e: MouseEvent) {
    e.preventDefault();
    const point = this.getPointerPosition(e);
    switch (this.state) {
      case BoardState.DRAW:
        this.draw.onPointerMove(point, this.strokeStyle.bufferSize);
        break;
      case BoardState.PAN:
        this.transform.onPointerMove(point, this.viewBox);
        break;
      default:
        throw new Error('Not state ' + this.state + ' in onPointerMove');
    }
  }

  private onPointerUp() {
    switch (this.state) {
      case BoardState.DRAW:
        this.draw.onPointerUp();
        break;
      case BoardState.PAN:
        this.transform.onPointerUp();
        break;
      default:
        throw new Error('Not state ' + this.state + ' in onPointerUp');
    }
  }

  private getPointerPosition(e: MouseEvent | WheelEvent): DOMPoint {
    const svgPoint = this.svg.createSVGPoint();
    svgPoint.x = e.clientX;
    svgPoint.y = e.clientY;
    // Null check is done in constructor
    return svgPoint.matrixTransform(
      (this.svg.getScreenCTM() as DOMMatrix).inverse(),
    );
  }
}
