import { EventType, SVG } from '../Interfaces/AppInterfaces';
import { singleton } from 'tsyringe';
import Dispatcher from './Dispatcher';
import { EventOrigin } from '../Interfaces/BoardInterfaces';

@singleton()
export class EventListenerController {
  // Event functions
  private isClick = true;
  private fnOnWheel: (e: WheelEvent) => void;
  private fnOnPointerDown: (e: MouseEvent) => void;
  private fnOnPointerMove: (e: MouseEvent) => void;
  private fnOnPointerUp: (e: MouseEvent) => void;
  private svg!: SVG;

  constructor(private dispatcher: Dispatcher, svgElement: HTMLElement) {
    this.fnOnWheel = this.onWheel;
    this.fnOnPointerDown = this.onPointerDown;
    this.fnOnPointerMove = this.onPointerMove;
    this.fnOnPointerUp = this.onPointerUp;
    this.svg = svgElement as any as SVG
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
    this.dispatcher.dispatchEvent({ eventType: EventType.ONWHEEL, e }, EventOrigin.USER);
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
      this.dispatcher.dispatchEvent({ eventType: EventType.CLICK, e }, EventOrigin.USER);
    } else {
      this.dispatcher.dispatchEvent({ eventType: EventType.POINTER_UP, e }, EventOrigin.USER);
    }
    this.isClick = false;
    this.svg.removeEventListener('mouseup', this.fnOnPointerUp); // Releasing the mouse
    this.svg.removeEventListener('mouseleave', this.fnOnPointerUp); // Releasing the mouse
    this.svg.removeEventListener('mousemove', this.fnOnPointerMove);
    this.svg.addEventListener('mousedown', this.fnOnPointerDown); // Pressing the mouse
  };

  private onPointerMove = (e: MouseEvent) => {
    if (this.isClick) {
      this.dispatcher.dispatchEvent({ eventType: EventType.POINTER_DOWN, e }, EventOrigin.USER);
      this.isClick = false;
    }
    this.dispatcher.dispatchEvent({ eventType: EventType.POINTER_MOVE, e }, EventOrigin.USER);
  };
}
