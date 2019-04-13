import { EventType } from '../utils/boardInterfaces';
import { AppController } from '../AppController';

export class EventController {
  // Event functions
  private fnOnWheel: (e: WheelEvent) => void;
  private fnOnPointerDown: (e: MouseEvent) => void;
  private fnOnPointerMove: (e: MouseEvent) => void;
  private fnOnPointerUp: (e: MouseEvent) => void;

  constructor(private svg: HTMLElement & SVGElement & SVGSVGElement, private app: AppController) {
    // Event Listeners
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
    this.app.dispatchEvent({ eventType: EventType.ONWHEEL, e });
  };

  private onPointerDown = (e: MouseEvent) => {
    this.app.dispatchEvent({ eventType: EventType.POINTER_DOWN, e });
    this.svg.removeEventListener('mousedown', this.fnOnPointerDown); // Pressing the mouse
    this.svg.addEventListener('mouseup', this.fnOnPointerUp); // Releasing the mouse
    this.svg.addEventListener('mouseleave', this.fnOnPointerUp); // Releasing the mouse
    this.svg.addEventListener('mousemove', this.fnOnPointerMove); // Mouse is moving
  };

  private onPointerUp = (e: MouseEvent) => {
    this.app.dispatchEvent({ eventType: EventType.POINTER_UP, e });
    this.svg.removeEventListener('mouseup', this.fnOnPointerUp); // Releasing the mouse
    this.svg.removeEventListener('mouseleave', this.fnOnPointerUp); // Releasing the mouse
    this.svg.removeEventListener('mousemove', this.fnOnPointerMove); // Mouse is moving
    this.svg.addEventListener('mousedown', this.fnOnPointerDown); // Pressing the mouse
  };

  private onPointerMove = (e: MouseEvent) => {
    this.app.dispatchEvent({ eventType: EventType.POINTER_MOVE, e });
  };
}
