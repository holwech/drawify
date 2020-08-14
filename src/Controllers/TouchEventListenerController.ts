import { EventType, SVG } from '../Interfaces/AppInterfaces';
import { IStrokePropOptions } from '../Interfaces/ActionInterfaces';
import { singleton } from 'tsyringe';
import Dispatcher from './Dispatcher';
import { EventOrigin } from '../Interfaces/BoardInterfaces';
import { MouseEventListenerController } from './MouseEventListenerController';

let DELTA_Y_LIMIT = 30;
let PAN_DELTA_LIM = 50;

@singleton()
export class TouchEventListenerController {
  // Event functions
  private isClick = true;

  private fnOnTouchStart: (e: TouchEvent) => void;
  private fnOnTouchMove: (e: TouchEvent) => void;
  private fnOnTouchEnd: (e: TouchEvent) => void;

  private touchCache: Touch[] = [];
  private originalTouchDiff: number = 0;
  private svg!: SVG;

  constructor(private dispatcher: Dispatcher, svgElement: HTMLElement) {

    this.fnOnTouchStart = this.onTouchStart;
    this.fnOnTouchMove = this.onTouchMove;
    this.fnOnTouchEnd = this.onTouchEnd;

    this.svg = (svgElement as any) as SVG;
  }

  public addEventListeners(): void {
    this.svg.addEventListener('touchstart', this.fnOnTouchStart);
  }

  public removeEventListeners(): void {
    this.svg.removeEventListener('touchstart', this.fnOnTouchStart);
  }

  private onTouchStart = (e: TouchEvent) => {
    e.preventDefault();
    this.isClick = true;

    for (var i = 0; i < e.changedTouches.length; i++) {
      if (this.touchCache.length > 2) {
        break;
      }
      this.touchCache.push(e.changedTouches[i])
    }

    this.svg.addEventListener('touchend', this.fnOnTouchEnd);
    this.svg.addEventListener('touchmove', this.fnOnTouchMove);
    if (this.touchCache.length == 2) {
      this.originalTouchDiff = this.calculateDiff(this.touchCache[0], this.touchCache[1]);
      this.svg.removeEventListener('touchstart', this.fnOnTouchStart);
    }
  };

  private onTouchMove = (e: TouchEvent) => {
    e.preventDefault();

    if (this.touchCache.length == 2) {
      let currentTouchDiff = this.calculateDiff(e.targetTouches.item(this.touchCache[0].identifier), e.targetTouches.item(this.touchCache[1].identifier));
      let pinchDiff: number = (currentTouchDiff - this.originalTouchDiff);

      if (Math.abs(pinchDiff) < PAN_DELTA_LIM) {
        // PAN
        // TODO implement
      } else {
        // PINCH
        let clientX: number = (this.touchCache[0].clientX + this.touchCache[1].clientX) / 2
        let clientY: number = (this.touchCache[0].clientY + this.touchCache[1].clientY) / 2
        let deltaY: number = Math.min(Math.max(-pinchDiff, -DELTA_Y_LIMIT), DELTA_Y_LIMIT);
        let event: WheelEvent = { clientX, clientY, deltaY, target: e.target } as WheelEvent

        this.dispatcher.dispatchEvent({ eventType: EventType.PINCH, e: event }, EventOrigin.USER);
      }
    } else {

      if (this.isClick) {
        this.dispatcher.dispatchEvent({ eventType: EventType.POINTER_DOWN, e }, EventOrigin.USER);
        this.isClick = false;
      }
      this.dispatcher.dispatchEvent({ eventType: EventType.POINTER_MOVE, e }, EventOrigin.USER);
    }
  };

  private onTouchEnd = (e: TouchEvent) => {
    e.preventDefault();
    if (this.isClick) {
      this.dispatcher.dispatchEvent({ eventType: EventType.CLICK, e }, EventOrigin.USER);
    } else {
      this.dispatcher.dispatchEvent({ eventType: EventType.POINTER_UP, e }, EventOrigin.USER);
    }

    for (var i = 0; i <= e.changedTouches.length; i++) {
      let endedTouchIndex = this.touchCache.findIndex(element => element.identifier === e.changedTouches[i].identifier);
      this.touchCache.splice(endedTouchIndex, 1);

      if (this.touchCache.length == 0) {
        this.svg.removeEventListener('touchend', this.fnOnTouchEnd);
        this.svg.removeEventListener('touchmove', this.fnOnTouchEnd);
        this.svg.addEventListener('touchstart', this.fnOnTouchStart);
      }
    }

    this.isClick = false;
  };

  private calculateDiff(touch1: Touch | null, touch2: Touch | null): number {
    if (touch1 == null || touch2 == null) return 0;
    return Math.abs(touch2.clientX - touch1.clientX) + Math.abs(touch2.clientY - touch1.clientY);
  }
}
