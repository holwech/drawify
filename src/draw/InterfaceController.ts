import { RecordController } from './recorder/RecordController';
import { DrawController } from './draw/DrawController';
import { IStrokeProps, EventType, BoardState } from './config/interfaces';

export class Controller {

  private svg: HTMLElement & SVGElement & SVGSVGElement;
  private recordLog: RecordController;
  private draw: DrawController;

  constructor(svgID: string, style: IStrokeProps) {
    this.svg = document.getElementById(svgID) as any as HTMLElement & SVGElement & SVGSVGElement;
    if (!this.svg.getScreenCTM()) {
      throw new Error('m variable is not defined in getPointFromViewBox in Transform');
    }
    let viewBox = { x: 0, y: 0, width: 1200, height: 800 };
    const viewboxElem = this.svg.getAttributeNS(null, 'viewBox');
    if (viewboxElem !== null) {
      const arr = viewboxElem.split(' ').map(Number);
      viewBox = { x: arr[0], y: arr[1], width: arr[2], height: arr[3] };
    } else {
      throw new Error('The SVG element requires the view box attribute to be set.');
    }
    this.draw = new DrawController(this.svg, style, viewBox);

    this.recordLog = new RecordController();
    this.addAllEventListeners();
  }

  public startRecording() {
    this.recordLog.start();
  }

  public pauseRecording() {
    this.recordLog.pause();
  }

  public stopRecording() {
    this.recordLog.stop();
  }

  public clear() {
    this.draw.execute({ eventType: EventType.CLEAR });
  }

  public setState(state: BoardState) {
    this.draw.execute({ eventType: EventType.SET_STATE, state });
  }

  public setStrokeProperties(strokeProps: IStrokeProps) {
    this.draw.execute({ eventType: EventType.SET_STROKE_PROPS, strokeProps });
  }

  private fnWheel = (e: WheelEvent) => {
    this.draw.execute({ eventType: EventType.ONWHEEL, e });
  }

  private fnOnPointerDown = (e: MouseEvent) => {
    this.draw.execute({ eventType: EventType.POINTER_DOWN, e });
  }

  private fnOnPointerUp = (e: MouseEvent) => {
    this.draw.execute({ eventType: EventType.POINTER_UP, e });
  }

  private fnOnPointerMove = (e: MouseEvent) => {
    this.draw.execute({ eventType: EventType.POINTER_MOVE, e });
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

}
