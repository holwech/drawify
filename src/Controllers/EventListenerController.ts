import { EventType, SVG } from '../Interfaces/AppInterfaces';
import { IStrokePropOptions } from '../Interfaces/ActionInterfaces';
import { singleton } from 'tsyringe';
import Dispatcher from './Dispatcher';
import { EventOrigin } from '../Interfaces/BoardInterfaces';

@singleton()
export class EventListenerController {
  // Event functions
  private isClick = true;
  private fnOnWheel: (e: WheelEvent) => void;
  private fnOnPointerDown: (e: MouseEvent) => void;
  private fnOnTouchStart: (e: TouchEvent) => void;

  private fnOnPointerMove: (e: MouseEvent) => void;
  private fnOnTouchMove: (e: TouchEvent) => void;
  
  private fnOnPointerUp: (e: MouseEvent) => void;
  private fnOnTouchEnd: (e: TouchEvent) => void;
  
  private fnOnPointerLeave: (e: MouseEvent) => void;
  private svg!: SVG;

  constructor(private dispatcher: Dispatcher, svgElement: HTMLElement) {
    this.fnOnWheel = this.onWheel;
    this.fnOnPointerDown = this.onPointerDown;
    this.fnOnTouchStart = this.onTouchStart;

    this.fnOnPointerMove = this.onPointerMove;
    this.fnOnTouchMove = this.onTouchMove;

    this.fnOnPointerUp = this.onPointerUp;
    this.fnOnTouchEnd = this.onTouchEnd;

    this.fnOnPointerLeave = this.onPointerLeave;
    this.svg = (svgElement as any) as SVG;
  }

  public addEventListeners(): void {
    this.svg.addEventListener('mousedown', this.fnOnPointerDown); // Pressing the mouse
    this.svg.addEventListener('touchstart', this.fnOnTouchStart); // Pressing the mouse
    this.svg.addEventListener('wheel', this.fnOnWheel);
  }

  public removeEventListeners(): void {
    this.svg.removeEventListener('mousedown', this.fnOnPointerDown); // Pressing the mouse
    this.svg.removeEventListener('wheel', this.fnOnWheel);
  }

  private onWheel = (e: WheelEvent) => {
    e.preventDefault();
    this.dispatcher.dispatchEvent({ eventType: EventType.ONWHEEL, e }, EventOrigin.USER);
  };

  private onPointerDown = (e: MouseEvent) => {
    e.preventDefault();
    this.isClick = true;
    this.svg.removeEventListener('mousedown', this.fnOnPointerDown); // Pressing the mouse
    this.svg.addEventListener('mouseup', this.fnOnPointerUp); // Releasing the mouse
    this.svg.addEventListener('mouseleave', this.fnOnPointerLeave); // Releasing the mouse
    this.svg.addEventListener('mousemove', this.fnOnPointerMove);
  };

  private onTouchStart = (e: TouchEvent) => {
    e.preventDefault();
    console.log('Touch started');
    this.isClick = true;
    this.svg.removeEventListener('touchstart', this.fnOnTouchStart); // Pressing the mouse
    this.svg.addEventListener('touchend', this.fnOnTouchEnd); // Releasing the mouse
    //this.svg.addEventListener('touchleave', this.fnOnPointerLeave); // Releasing the mouse
    this.svg.addEventListener('touchmove', this.fnOnTouchMove);
  };


  private onPointerUp = (e: MouseEvent) => {
    e.preventDefault();
    console.log('pointer up');
    if (this.isClick) {
      this.dispatcher.dispatchEvent({ eventType: EventType.CLICK, e }, EventOrigin.USER);
    } else {
      this.dispatcher.dispatchEvent({ eventType: EventType.POINTER_UP, e }, EventOrigin.USER);
    }
    this.isClick = false;
    this.svg.removeEventListener('mouseup', this.fnOnPointerUp); // Releasing the mouse
    this.svg.removeEventListener('mouseleave', this.fnOnPointerLeave); // Releasing the mouse
    this.svg.removeEventListener('mousemove', this.fnOnPointerMove);
    this.svg.addEventListener('mousedown', this.fnOnPointerDown); // Pressing the mouse
  };

  private onTouchEnd = (e: TouchEvent) => {
    e.preventDefault();
    console.log('touch end');
    if (this.isClick) {
      this.dispatcher.dispatchEvent({ eventType: EventType.CLICK,  }, EventOrigin.USER);
    } else {
      this.dispatcher.dispatchEvent({ eventType: EventType.POINTER_UP,  }, EventOrigin.USER);
    }
    this.isClick = false;
    this.svg.removeEventListener('touchend', this.fnOnTouchEnd); // Releasing the mouse
    this.svg.removeEventListener('mouseleave', this.fnOnPointerLeave); // Releasing the mouse
    this.svg.removeEventListener('mousemove', this.fnOnPointerMove);
    this.svg.addEventListener('mousedown', this.fnOnPointerDown); // Pressing the mouse
  };
  
  private onPointerLeave = (e: MouseEvent) => {
    e.preventDefault();
    console.log('pointer leave');
    console.log(this.svg)
    if (this.isClick) {
      this.dispatcher.dispatchEvent({ eventType: EventType.CLICK, e }, EventOrigin.USER);
    } else {
      this.dispatcher.dispatchEvent({ eventType: EventType.POINTER_UP, e }, EventOrigin.USER);
    }
    this.isClick = false;
    this.svg.removeEventListener('mouseup', this.fnOnPointerUp); // Releasing the mouse
    this.svg.removeEventListener('mouseleave', this.fnOnPointerLeave); // Releasing the mouse
    this.svg.removeEventListener('mousemove', this.fnOnPointerMove);
    this.svg.addEventListener('mousedown', this.fnOnPointerDown); // Pressing the mouse
  };

  private onPointerMove = (e: MouseEvent) => {
    e.preventDefault();
    if (this.isClick) {
      this.dispatcher.dispatchEvent({ eventType: EventType.POINTER_DOWN, e }, EventOrigin.USER);
      this.isClick = false;
    }
    this.dispatcher.dispatchEvent({ eventType: EventType.POINTER_MOVE, e }, EventOrigin.USER);
  };

  private onTouchMove = (e: TouchEvent) => {
    e.preventDefault();
    console.log('touchmove');
    if (this.isClick) {
      this.dispatcher.dispatchEvent({ eventType: EventType.POINTER_DOWN, }, EventOrigin.USER);
      this.isClick = false;
    }
    this.dispatcher.dispatchEvent({ eventType: EventType.POINTER_MOVE, }, EventOrigin.USER);
  };
}
