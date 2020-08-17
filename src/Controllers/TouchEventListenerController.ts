import { EventType, SVG } from '../Interfaces/AppInterfaces';
import { IStrokePropOptions } from '../Interfaces/ActionInterfaces';
import { singleton } from 'tsyringe';
import Dispatcher from './Dispatcher';
import { EventOrigin } from '../Interfaces/BoardInterfaces';
import { MouseEventListenerController } from './MouseEventListenerController';

let DELTA_Y_LIMIT = 30;
let PAN_DELTA_LIM = 50;

// Temp log write code
////////////////////////////////////

// Overriding console object
let console = { log: (e: any) => { } };

// Getting div to insert logs
let logger = document.getElementById('logger');

console.log = text => {
  let element = document.getElementById('loggerdiv')
  let txt = document.createTextNode(text + "\n");
  element!.appendChild(txt);
  if (logger) {
    logger!.appendChild(element as HTMLElement);
  }
};

////////////////////////////////////

@singleton()
export class TouchEventListenerController {
  // Event functions
  private isClick = true;

  private fnOnTouchStart: (e: TouchEvent) => void;
  private fnOnTouchMove: (e: TouchEvent) => void;
  private fnOnTouchEnd: (e: TouchEvent) => void;

  private touchCache: Touch[] = [];
  // private originalTouchDiff: number = 0;
  // private previousTouches: Touch[] = [];
  private previousTouches: TouchList = { length: 0 } as TouchList;
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

    // for (var i = 0; i < e.changedTouches.length; i++) {
    //   if (this.previousTouches.length > 2) {
    //     break;
    //   }
    //   this.previousTouches.push(e.changedTouches[i])
    // }

    this.svg.addEventListener('touchend', this.fnOnTouchEnd);
    this.svg.addEventListener('touchmove', this.fnOnTouchMove);
    // if (this.touchCache.length == 2) {
    //   // this.originalTouchDiff = this.calculateDiff(this.touchCache[0], this.touchCache[1]);
    //   this.svg.removeEventListener('touchstart', this.fnOnTouchStart);
    // }
  };

  private onTouchMove = (e: TouchEvent) => {
    e.preventDefault();
    if (this.previousTouches.length == 0) {
      this.previousTouches = e.targetTouches;
    }
    // console.log('previousTouchesLength: ' + this.previousTouches.length);
    // console.log('targetTouches.length: ' + e.targetTouches.length);

    if (e.targetTouches.length >= 2 && this.previousTouches.length >= 2) {
      // console.log('previousTouche0: ' + this.previousTouches[0])
      // console.log('previousTouche1: ' + this.previousTouches[1])
      let currentTouch0: Touch | null = e.targetTouches.item(this.previousTouches[0].identifier);
      let currentTouch1: Touch | null = e.targetTouches.item(this.previousTouches[1].identifier);

      // console.log('targetTouch0: ' + currentTouch0)
      // console.log('targetTouch1: ' + currentTouch1)

      if (currentTouch0 && currentTouch1) {
        let currentTouches: Touch[] = [currentTouch0, currentTouch1];
        // diff for touch 0
        let xDiff0 = currentTouches[0]!.clientX - this.previousTouches[0].clientX;
        let yDiff0 = currentTouches[0]!.clientY - this.previousTouches[0].clientY;
        // diff for touch 1
        let xDiff1 = currentTouches[1]!.clientX - this.previousTouches[1].clientX;
        let yDiff1 = currentTouches[1]!.clientY - this.previousTouches[1].clientY;

        // let currentTouchDiff = this.calculateDiff(e.targetTouches.item(this.touchCache[0].identifier), e.targetTouches.item(this.touchCache[1].identifier));
        let pinchDiff: number = (xDiff1 - xDiff0) + (yDiff1 - yDiff0);

        console.log('pinchDiff: ' + pinchDiff)

        // TODO add check for swipe (same direction off diff)

        // PINCH
        let clientX: number = (currentTouches[0]!.clientX + currentTouches[1]!.clientX) / 2
        let clientY: number = (currentTouches[0]!.clientY + currentTouches[1]!.clientY) / 2
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

    this.previousTouches = e.targetTouches;
  };

  private onTouchEnd = (e: TouchEvent) => {
    e.preventDefault();
    if (this.isClick) {
      this.dispatcher.dispatchEvent({ eventType: EventType.CLICK, e }, EventOrigin.USER);
    } else {
      this.dispatcher.dispatchEvent({ eventType: EventType.POINTER_UP, e }, EventOrigin.USER);
    }

    // for (var i = 0; i <= e.changedTouches.length; i++) {
    //   let endedTouchIndex = this.touchCache.findIndex(element => element.identifier === e.changedTouches[i].identifier);
    // this.touchCache.splice(endedTouchIndex, 1);

    if (e.targetTouches.length == 0) {
      this.svg.removeEventListener('touchend', this.fnOnTouchEnd);
      this.svg.removeEventListener('touchmove', this.fnOnTouchEnd);
      this.svg.addEventListener('touchstart', this.fnOnTouchStart);
    }
    // }

    if (this.touchCache.length < 1) {
      this.svg.style.backgroundColor = '#FFFFFF';
    }

    this.isClick = false;
  };

  private calculateDiff(touch1: Touch | null, touch2: Touch | null): number {
    if (touch1 == null || touch2 == null) return 0;
    return Math.abs(touch2.clientX - touch1.clientX) + Math.abs(touch2.clientY - touch1.clientY);
  }

  // private calculateAvgPos(touch1: Touch | null, touch2: Touch | null): object {
  //   if (touch1 == null || touch2 == null) return { clientX: 0, clientY: 0 };
  //   return { clientX: touch1.clientX + touch2.clientX, clientY: touch1.clientX + touch2.clientX }
  // }
}
