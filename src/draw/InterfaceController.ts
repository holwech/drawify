import { RecordController } from './recorder/RecordController';
import { DrawController } from './draw/DrawController';
import { IStrokeProps, EventType, BoardState, IEvent, IViewBox } from './utils/interfaces';

export class Controller {
  // Event functions
  private fnOnWheel: (e: WheelEvent) => void;
  private fnOnPointerDown: (e: MouseEvent) => void;
  private fnOnPointerMove: (e: MouseEvent) => void;
  private fnOnPointerUp: (e: MouseEvent) => void;

  private svg: HTMLElement & SVGElement & SVGSVGElement;
  private recordLog: RecordController;
  private draw: DrawController;

  constructor(svgID: string, strokeProps: IStrokeProps) {
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

    const initialState = [
      { eventType: EventType.SET_STROKE_PROPS, strokeProps },
      { eventType: EventType.SET_VIEWBOX, viewBox },
    ];
    this.draw = new DrawController(this.svg, initialState);
    this.recordLog = new RecordController(initialState);

    // Event Listenerws
    this.fnOnWheel = this.onWheel;
    this.fnOnPointerDown = this.onPointerDown;
    this.fnOnPointerMove = this.onPointerMove;
    this.fnOnPointerUp = this.onPointerUp;
  }

  public startRecording(): void {
    this.svg.addEventListener('mousedown', this.fnOnPointerDown); // Pressing the mouse
    this.svg.addEventListener('wheel', this.fnOnWheel);
    this.recordLog.start();
  }

  public pauseRecording(): void {
    this.svg.addEventListener('mousedown', this.fnOnPointerDown); // Pressing the mouse
    this.svg.addEventListener('wheel', this.fnOnWheel);
    this.recordLog.pause();
  }

  public stopRecording(): void {
    this.svg.removeEventListener('mousedown', this.fnOnPointerDown); // Pressing the mouse
    this.svg.removeEventListener('wheel', this.fnOnWheel);
    this.recordLog.stop();
  }

  public printLog(): void {
    this.recordLog.printLog();
  }

  public clear(): void {
    this.dispatchEvent({ eventType: EventType.CLEAR });
  }

  public setState(state: BoardState): void {
    this.dispatchEvent({ eventType: EventType.SET_STATE, state });
  }

  public setStrokeProperties(strokeProps: IStrokeProps): void {
    this.dispatchEvent({ eventType: EventType.SET_STROKE_PROPS, strokeProps });
  }

  public setViewBox(viewBox: IViewBox): void {
    this.dispatchEvent({ eventType: EventType.SET_VIEWBOX, viewBox });
  }

  private onWheel = (e: WheelEvent) => {
    this.dispatchEvent({ eventType: EventType.ONWHEEL, e });
  }

  private onPointerDown = (e: MouseEvent) => {
    this.dispatchEvent({ eventType: EventType.POINTER_DOWN, e });
    this.svg.removeEventListener('mousedown', this.fnOnPointerDown); // Pressing the mouse
    this.svg.addEventListener('mouseup', this.fnOnPointerUp); // Releasing the mouse
    this.svg.addEventListener('mouseleave', this.fnOnPointerUp); // Releasing the mouse
    this.svg.addEventListener('mousemove', this.fnOnPointerMove); // Mouse is moving
  }

  private onPointerUp = (e: MouseEvent) => {
    this.dispatchEvent({ eventType: EventType.POINTER_UP, e });
    this.svg.removeEventListener('mouseup', this.fnOnPointerUp); // Releasing the mouse
    this.svg.removeEventListener('mouseleave', this.fnOnPointerUp); // Releasing the mouse
    this.svg.removeEventListener('mousemove', this.fnOnPointerMove); // Mouse is moving
    this.svg.addEventListener('mousedown', this.fnOnPointerDown); // Pressing the mouse
  }

  private onPointerMove = (e: MouseEvent) => {
    this.dispatchEvent({ eventType: EventType.POINTER_MOVE, e });
  }

  private dispatchEvent(event: IEvent): void {
    this.draw.execute(event);
    this.recordLog.dispatch(event);
  }
}
