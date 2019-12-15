import { EventOrigin } from '../utils/boardInterfaces';
import { EventType } from '../utils/appInterfaces';
import { AppController } from '../AppController';
import { injectable } from 'tsyringe';

@injectable()
export class EventListenerController {
  // Event functions
  private isClick = true;
  private fnOnWheel: (e: WheelEvent) => void;
  private fnOnPointerDown: (e: MouseEvent) => void;
  private fnOnPointerMove: (e: MouseEvent) => void;
  private fnOnPointerUp: (e: MouseEvent) => void;

  private svg!: HTMLElement & SVGElement & SVGSVGElement;

  public init(svg: HTMLElement & SVGElement & SVGSVGElement) {
    this.svg = svg;
  }

  constructor(private app: AppController) {
    this.fnOnWheel = this.onWheel;
    this.fnOnPointerDown = this.onPointerDown;
    this.fnOnPointerMove = this.onPointerMove;
    this.fnOnPointerUp = this.onPointerUp;
  }

  public addEventListeners(): void {
    this.svg.addEventListener('mousedown', this.fnOnPointerDown); // Pressing the mouse
    this.svg.addEventListener('wheel', this.fnOnWheel);
  }

  public removeEventListeners(): void {
    this.svg.removeEventListener('mousedown', this.fnOnPointerDown); // Pressing the mouse
    this.svg.removeEventListener('wheel', this.fnOnWheel);
  }

  private onWheel = (e: WheelEvent) => {
    this.app.action.dispatchEvent({ eventType: EventType.ONWHEEL, e }, EventOrigin.USER);
  };

  private onPointerDown = (e: MouseEvent) => {
    this.isClick = true;
    this.svg.removeEventListener('mousedown', this.fnOnPointerDown); // Pressing the mouse
    this.svg.addEventListener('mouseup', this.fnOnPointerUp); // Releasing the mouse
    this.svg.addEventListener('mouseleave', this.fnOnPointerUp); // Releasing the mouse
    this.svg.addEventListener('mousemove', this.fnOnPointerMove);
  };

  private onPointerUp = (e: MouseEvent) => {
    if (this.isClick) {
      this.app.action.dispatchEvent({ eventType: EventType.CLICK, e }, EventOrigin.USER);
    } else {
      this.app.action.dispatchEvent({ eventType: EventType.POINTER_UP, e }, EventOrigin.USER);
    }
    this.isClick = false;
    this.svg.removeEventListener('mouseup', this.fnOnPointerUp); // Releasing the mouse
    this.svg.removeEventListener('mouseleave', this.fnOnPointerUp); // Releasing the mouse
    this.svg.removeEventListener('mousemove', this.fnOnPointerMove);
    this.svg.addEventListener('mousedown', this.fnOnPointerDown); // Pressing the mouse
  };

  private onPointerMove = (e: MouseEvent) => {
    if (this.isClick) {
      this.app.action.dispatchEvent({ eventType: EventType.POINTER_DOWN, e }, EventOrigin.USER);
      this.isClick = false;
    }
    this.app.action.dispatchEvent({ eventType: EventType.POINTER_MOVE, e }, EventOrigin.USER);
  };
}
