import { EventOrigin } from '../utils/boardInterfaces';
import { EventType } from '../utils/appInterfaces';
import { AppController } from '../AppController';

export class EventListenerController {
  // Event functions
  private isClick = true;
  private fnOnWheel: (e: WheelEvent) => void;
  private fnOnPointerDown: (e: MouseEvent) => void;
  private fnOnPointerMove: (e: MouseEvent) => void;
  private fnOnPointerUp: (e: MouseEvent) => void;
  // private fnOnClick: (e: MouseEvent) => void;

  constructor(private svg: HTMLElement & SVGElement & SVGSVGElement, private app: AppController) {
    // Event Listeners
    this.fnOnWheel = this.onWheel;
    this.fnOnPointerDown = this.onPointerDown;
    this.fnOnPointerMove = this.onPointerMove;
    this.fnOnPointerUp = this.onPointerUp;
    // this.fnOnClick = this.onClick;
  }

  public addEventListeners(): void {
    // this.svg.addEventListener('click', this.fnOnClick);
    this.svg.addEventListener('mousedown', this.fnOnPointerDown); // Pressing the mouse
    this.svg.addEventListener('wheel', this.fnOnWheel);
  }

  public removeEventListeners(): void {
    this.svg.removeEventListener('mousedown', this.fnOnPointerDown); // Pressing the mouse
    this.svg.removeEventListener('wheel', this.fnOnWheel);
  }

  private onWheel = (e: WheelEvent) => {
    this.app.action.dispatch({ eventType: EventType.ONWHEEL, e }, EventOrigin.USER);
  };

  private onPointerDown = (e: MouseEvent) => {
    // console.log('POINTER DOWN ADDING EVENT LISTENER');
    this.app.action.dispatch({ eventType: EventType.POINTER_DOWN, e }, EventOrigin.USER);
    this.svg.removeEventListener('mousedown', this.fnOnPointerDown); // Pressing the mouse
    this.svg.addEventListener('mouseup', this.fnOnPointerUp); // Releasing the mouse
    this.svg.addEventListener('mouseleave', this.fnOnPointerUp); // Releasing the mouse
    this.svg.addEventListener('mousemove', this.fnOnPointerMove);
  };

  private onPointerUp = (e: MouseEvent) => {
    // console.log('POINTER UP REMOVING EVENT LISTENER');
    if (this.isClick) {
      this.app.action.dispatch({ eventType: EventType.CLICK, e }, EventOrigin.USER);
    } else {
      this.app.action.dispatch({ eventType: EventType.POINTER_UP, e }, EventOrigin.USER);
    }
    this.isClick = true;
    this.svg.removeEventListener('mouseup', this.fnOnPointerUp); // Releasing the mouse
    this.svg.removeEventListener('mouseleave', this.fnOnPointerUp); // Releasing the mouse
    this.svg.removeEventListener('mousemove', this.fnOnPointerMove);
    this.svg.addEventListener('mousedown', this.fnOnPointerDown); // Pressing the mouse
  };

  private onPointerMove = (e: MouseEvent) => {
    this.isClick = false;
    this.app.action.dispatch({ eventType: EventType.POINTER_MOVE, e }, EventOrigin.USER);
  };

  // private onClick = (e: MouseEvent) => {
  //   this.app.action.dispatch({ eventType: EventType.CLICK, e }, EventOrigin.USER);
  // }
}
