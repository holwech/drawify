import { EventType, SVG } from '../Interfaces/AppInterfaces';
import { singleton } from 'tsyringe';
import Dispatcher from './Dispatcher';

@singleton()
export class EventListenerController {
  // Event functions
  private isClick = true;
  private fnOnWheel: (e: WheelEvent) => void;
  private fnOnPointerDown: (e: PointerEvent) => void;
  private fnOnPointerMove: (e: PointerEvent) => void;
  private fnOnPointerUp: (e: PointerEvent) => void;
  private svg!: SVG;

  constructor(private dispatcher: Dispatcher, svgElement: HTMLElement) {
    this.fnOnWheel = this.onWheel;
    this.fnOnPointerDown = this.onPointerDown;
    this.fnOnPointerMove = this.onPointerMove;
    this.fnOnPointerUp = this.onPointerUp;
    this.svg = (svgElement as any) as SVG;
  }

  public addEventListeners(): void {
    this.svg.addEventListener('pointerdown', this.fnOnPointerDown); // Pressing the mouse
    this.svg.addEventListener('wheel', this.fnOnWheel);
  }

  public removeEventListeners(): void {
    this.svg.removeEventListener('pointerdown', this.fnOnPointerDown); // Pressing the mouse
    this.svg.removeEventListener('wheel', this.fnOnWheel);
  }

  private onWheel = (e: WheelEvent) => {
    e.preventDefault();
    this.dispatcher.dispatchEvent({ eventType: EventType.ONWHEEL, e: e });
  };

  private onPointerDown = (e: PointerEvent) => {
    e.preventDefault();
    this.isClick = true;
    this.svg.removeEventListener('pointerdown', this.fnOnPointerDown); // Pressing the mouse
    this.svg.addEventListener('pointerup', this.fnOnPointerUp); // Releasing the mouse
    this.svg.addEventListener('pointerleave', this.fnOnPointerUp); // Releasing the mouse
    this.svg.addEventListener('pointermove', this.fnOnPointerMove);
  };

  private onPointerUp = (e: PointerEvent) => {
    e.preventDefault();
    if (this.isClick) {
      this.dispatcher.dispatchEvent({ eventType: EventType.CLICK, e });
    } else {
      this.dispatcher.dispatchEvent({ eventType: EventType.POINTER_UP, e });
    }
    this.isClick = false;
    this.svg.removeEventListener('pointerup', this.fnOnPointerUp); // Releasing the mouse
    this.svg.removeEventListener('pointerleave', this.fnOnPointerUp); // Releasing the mouse
    this.svg.removeEventListener('pointermove', this.fnOnPointerMove);
    this.svg.addEventListener('pointerdown', this.fnOnPointerDown); // Pressing the mouse
  };

  private onPointerMove = (e: PointerEvent) => {
    e.preventDefault();
    if (this.isClick) {
      this.dispatcher.dispatchEvent({ eventType: EventType.POINTER_DOWN, e });
      this.isClick = false;
    }
    this.dispatcher.dispatchEvent({ eventType: EventType.POINTER_MOVE, e });
  };
}
