import { SVGDraw } from './SVGDraw';
import { Transform } from './Transform';
import { IStrokeProps, IViewBox, BoardState, IEvent, EventType } from '../utils/boardInterfaces';
import { AppController } from '../AppController';

const SCALE_FACTOR = 0.05;

export class BoardController {
  // State properties
  private scale = 1;
  private state = BoardState.DRAW;
  private app: AppController;
  private strokeProps: IStrokeProps = {
    color: 'green',
    width: 50,
    bufferSize: 20,
  };
  private viewBox: IViewBox = {
    x: 0, y: 0, width: 1200, height: 800,
  };

  private svg: HTMLElement & SVGElement & SVGSVGElement;
  private draw: SVGDraw;
  private transform: Transform;

  constructor(
    svgElement: HTMLElement & SVGElement & SVGSVGElement,
    app: AppController,
    initialState: IEvent[] = [],
  ) {
    this.svg = svgElement;
    this.app = app;
    this.draw = new SVGDraw(this.svg);
    this.transform = new Transform(this.svg);
    initialState.forEach((event) => {
      this.execute(event);
    });
  }

  public execute(event: IEvent): void {
    switch (event.eventType) {
      case EventType.POINTER_MOVE:
        this.onPointerMove(event.e!);
        break;
      case EventType.POINTER_DOWN:
        this.onPointerDown(event.e!);
        break;
      case EventType.POINTER_UP:
        this.onPointerUp();
        break;
      case EventType.SET_STROKE_PROPS:
        this.setStrokeProperties(event.strokeProps!);
        break;
      case EventType.ONWHEEL:
        this.onWheel(event.e as WheelEvent);
        break;
      case EventType.CLEAR:
        this.clear();
        break;
      case EventType.SET_STATE:
        this.setState(event.state!);
        break;
      case EventType.SET_VIEWBOX:
        this.setViexBox(event.viewBox!);
        break;
      default:
        break;
    }
  }

  private setState(state: BoardState): void {
    this.state = state;
  }

  private clear(): void {
    this.draw.clear();
  }

  private setStrokeProperties(strokeProps: IStrokeProps): void {
    this.strokeProps.bufferSize = strokeProps.bufferSize;
    this.strokeProps.color = strokeProps.color;
    this.strokeProps.width = strokeProps.width * this.scale;
  }

  private setViexBox(viexBox: IViewBox): void {
    this.viewBox = viexBox;
  }

  private onWheel(e: WheelEvent): void {
    e.preventDefault();
    if (this.state === BoardState.PAN) {
      const scale = e.deltaY > 0 ? 1 + SCALE_FACTOR : 1 - SCALE_FACTOR;
      this.strokeProps.width = this.strokeProps.width * scale;
      const point = this.getPointerPosition(e);
      this.transform.onWheel(point, this.viewBox, scale);
      this.scale *= scale;
    }
  }

  private onPointerDown(e: MouseEvent): void {
    e.preventDefault();
    const point = this.getPointerPosition(e);
    switch (this.state) {
      case BoardState.DRAW:
        this.draw.onPointerDown(point, this.strokeProps);
        break;
      case BoardState.PAN:
        this.transform.onPointerDown(point);
        break;
      default:
        throw new Error('No state ' + this.state + ' in onPointerDown');
    }
  }

  private onPointerMove(e: MouseEvent): void {
    e.preventDefault();
    const point = this.getPointerPosition(e);
    switch (this.state) {
      case BoardState.DRAW:
        this.draw.onPointerMove(point, this.strokeProps.bufferSize);
        break;
      case BoardState.PAN:
        this.transform.onPointerMove(point, this.viewBox);
        break;
      default:
        throw new Error('Not state ' + this.state + ' in onPointerMove');
    }
  }

  private onPointerUp(): void {
    switch (this.state) {
      case BoardState.DRAW:
        this.draw.onPointerUp();
        break;
      case BoardState.PAN:
        this.transform.onPointerUp();
        break;
      default:
        throw new Error('Not state ' + this.state + ' in onPointerUp');
    }
  }

  private getPointerPosition(e: MouseEvent | WheelEvent): DOMPoint {
    const svgPoint = this.svg.createSVGPoint();
    svgPoint.x = e.clientX;
    svgPoint.y = e.clientY;
    // Null check is done in constructor
    return svgPoint.matrixTransform(
      (this.svg.getScreenCTM() as DOMMatrix).inverse(),
    );
  }
}
