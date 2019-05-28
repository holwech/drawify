import { SVGDraw } from './SVGDraw';
import { Transform } from './Transform';
import { IStrokeProps, IViewBox, BoardState, IEvent } from '../utils/boardInterfaces';
import { Board } from './Board';
import { IAction, Targets, IDrawOptions, PointerActionType } from '../event/eventInterfaces';

const SCALE_FACTOR = 0.05;

export class BoardController {
  // State properties
  private scale = 1;
  private state = BoardState.DRAW;
  private strokeProps: IStrokeProps = {
    color: 'green',
    width: 50,
    bufferSize: 20,
    fill: undefined,
  };
  private viewBox: IViewBox = {
    x: 0,
    y: 0,
    width: 1200,
    height: 800,
  };
  private drawers: any = {};
  private transform: Transform;
  private board: Board;

  constructor(
    private svg: HTMLElement & SVGElement & SVGSVGElement,
  ) {
    this.board = new Board(this.svg);
    this.transform = new Transform(this.svg);
  }

  public execute(action: IAction): void {
    switch (action.target) {
      case Targets.DRAW:
        this.onDrawAction(action, action.options as IDrawOptions);
        break;
      case Targets.VIEW_BOX:
        this.setViexBox()
        break;
      default:
        break;
    }
  }

  private onDrawAction(action: IAction, options: IDrawOptions): void {
    const e = options.event;
    e.preventDefault();
    const point = this.getPointerPosition(e);
    switch (options.type) {
      case PointerActionType.START:
        this.drawers[action.id] = new SVGDraw(this.svg, action.id);
        this.drawers[action.id].onPointerDown(point, this.strokeProps);
        break;
      case PointerActionType.MOVE:
        this.drawers[action.id].onPointerMove(point, this.strokeProps.bufferSize);
        break;
      case PointerActionType.STOP:
        this.drawers[action.id].onPointerUp();
        delete this.drawers[action.id];
        break;
      default:
        break;
    }
  }

  // public execute(event: IEvent): void {
  //   switch (event.eventType) {
  //     case EventType.POINTER_MOVE:
  //       this.onPointerMove(event);
  //       break;
  //     case EventType.POINTER_DOWN:
  //       this.onPointerDown(event);
  //       break;
  //     case EventType.POINTER_UP:
  //       this.onPointerUp(event);
  //       break;
  //     case EventType.SET_STROKE_PROPS:
  //       this.setStrokeProperties(event.strokeProps!);
  //       break;
  //     case EventType.ONWHEEL:
  //       this.onWheel(event);
  //       break;
  //     case EventType.CLICK:
  //       this.onClick(event);
  //       break;
  //     case EventType.CLEAR:
  //       // Temp fix for now
  //       // How should scale be set for different viewboxes?
  //       this.scale = 1;
  //       this.board.clear();
  //       break;
  //     case EventType.SET_STATE:
  //       this.setState(event.state!);
  //       break;
  //     case EventType.SET_VIEWBOX:
  //       this.setViexBox(event.viewBox!);
  //       break;
  //     case EventType.RESET:
  //       this.scale = 1;
  //       this.board.clear();
  //       break;
  //     default:
  //       break;
  //   }
  // }

  private setState(state: BoardState): void {
    this.state = state;
  }

  private setStrokeProperties(strokeProps: IStrokeProps): void {
    this.strokeProps.bufferSize = strokeProps.bufferSize;
    this.strokeProps.color = strokeProps.color;
    this.strokeProps.width = strokeProps.width * this.scale;
    this.strokeProps.fill = strokeProps.fill;
  }

  private setViexBox(viexBox: IViewBox): void {
    this.viewBox = viexBox;
  }

  private onClick(event: IEvent): void {
    const e = event.e! as MouseEvent;
    e.preventDefault();
    if (this.state === BoardState.PAN) {
      console.log('onClick in BoardController: ', event.time! / 1000);
      const ids = (e.target as Element).id;
      const id = Number(ids);
      if (id) {
        this.board.removeElement(id);
      }
    }
  }

  private onWheel(event: IEvent): void {
    const e = event.e! as WheelEvent;
    e.preventDefault();
    if (this.state === BoardState.PAN) {
      const scale = e.deltaY > 0 ? 1 + SCALE_FACTOR : 1 - SCALE_FACTOR;
      this.strokeProps.width = this.strokeProps.width * scale;
      const point = this.getPointerPosition(e);
      this.transform.onWheel(point, this.viewBox, scale);
      this.scale *= scale;
    }
  }

  private onPointerDown(event: IEvent): void {
    const e = event.e! as MouseEvent;
    e.preventDefault();
    const point = this.getPointerPosition(e);
    switch (this.state) {
      case BoardState.DRAW:
        this.drawers[event.id!] = new SVGDraw(this.svg, event.id!);
        this.drawers[event.id!].onPointerDown(point, this.strokeProps);
        break;
      case BoardState.PAN:
        this.transform.onPointerDown(point);
        break;
      default:
        throw new Error('No state ' + this.state + ' in onPointerDown');
    }
  }

  private onPointerMove(event: IEvent): void {
    const e = event.e as MouseEvent;
    e.preventDefault();
    const point = this.getPointerPosition(e);
    switch (this.state) {
      case BoardState.DRAW:
        this.drawers[event.id!].onPointerMove(point, this.strokeProps.bufferSize);
        break;
      case BoardState.PAN:
        this.transform.onPointerMove(point, this.viewBox);
        break;
      default:
        throw new Error('Not state ' + this.state + ' in onPointerMove');
    }
  }

  private onPointerUp(event: IEvent): void {
    switch (this.state) {
      case BoardState.DRAW:
        this.drawers[event.id!].onPointerUp();
        delete this.drawers[event.id!];
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
    return svgPoint.matrixTransform((this.svg.getScreenCTM() as DOMMatrix).inverse());
  }
}
