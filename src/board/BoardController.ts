import { SVGDraw } from './SVGDraw';
import { Transform } from './Transform';
import { IStrokeProps, IViewBox, BoardState } from '../utils/boardInterfaces';
import { Board } from './Board';
import {
  IAction,
  Targets,
  IDrawOptions,
  PointerActionType,
  IStrokePropOptions,
  IPanOptions,
  IZoomOptions,
  StrokeAttributes,
  IClickOptions,
  ElementClickACtionType,
} from '../action/ActionInterfaces';
import { IEvent } from '../utils/appInterfaces';
import { injectable } from 'tsyringe';

const SCALE_FACTOR = 0.05;

@injectable()
export class BoardController {
  // State properties
  private scale = 1;
  private state = BoardState.DRAW;
  private strokeProps: IStrokeProps = {
    stroke: 'green',
    'stroke-width': 50,
    'buffer-size': 20,
    fill: undefined,
  };
  private viewBoxInit = {
    x: 0,
    y: 0,
    width: 1200,
    height: 800,
  };
  private viewBox: IViewBox = this.viewBoxInit;
  private drawers: any = {};
  private elementBuffer: any[] = [];
  private transform!: Transform;
  private board!: Board;
  private svg!: HTMLElement & SVGElement & SVGSVGElement;

  public init(svg: HTMLElement & SVGElement & SVGSVGElement) {
    this.svg = svg;
    this.board.init(svg);
    this.transform.init(svg);
  }

  public execute(action: IAction): void {
    switch (action.target) {
      case Targets.DRAW:
        this.draw(action, action.options as IDrawOptions);
        break;
      case Targets.PAN:
        this.pan(action.options as IPanOptions);
        break;
      case Targets.ZOOM:
        this.zoom(action.options as IZoomOptions);
        break;
      case Targets.CLICK:
        this.click(action.options as IClickOptions);
        break;
      case Targets.STROKE_PROP:
        this.setStrokeProperties(action.options as IStrokePropOptions);
        break;
      case Targets.VIEW_BOX:
        this.setViexBox(action.options as IViewBox);
        break;
      case Targets.CLEAR:
        this.board.clear();
        break;
      default:
        break;
    }
  }

  public predraw(): void {
    this.elementBuffer.forEach((el) => {
      this.svg.appendChild(el);
    });
    this.elementBuffer = [];
  }

  private click(options: IClickOptions): void {
    const e = options.event! as MouseEvent;
    e.preventDefault();
    switch (options.type) {
      case ElementClickACtionType.REMOVE:
        const ids = (e.target as Element).id;
        const id = Number(ids);
        if (id) {
          this.board.removeElement(id);
        }
        break;
      default:
        break;
    }
  }

  private zoom(options: IZoomOptions): void {
    const e = options.event;
    e.preventDefault();
    const modifier = e.deltaY > 0 ? 1 + SCALE_FACTOR : 1 - SCALE_FACTOR;
    this.scale *= modifier;
    this.strokeProps['stroke-width'] = this.strokeProps['stroke-width'] * modifier;
    const point = this.getPointerPosition(e);
    this.transform.zoom(point, this.viewBox, modifier);
  }

  private draw(action: IAction, options: IDrawOptions): void {
    const e = options.event;
    e.preventDefault();
    const point = this.getPointerPosition(e);
    switch (options.type) {
      case PointerActionType.MOVE:
        this.drawers[action.id!].onPointerMove(point, this.strokeProps['buffer-size']);
        break;
      case PointerActionType.START:
        this.drawers[action.id!] = new SVGDraw(this.svg, action.id!);
        const path = this.drawers[action.id!].onPointerDown(point, this.strokeProps);
        this.svg.appendChild(path);
        if (action.time === 0) {
          this.elementBuffer.push(path);
        }
        break;
      case PointerActionType.STOP:
        this.drawers[action.id!].onPointerUp();
        delete this.drawers[action.id!];
        break;
      default:
        break;
    }
  }

  private pan(options: IPanOptions): void {
    const e = options.event;
    e.preventDefault();
    const point = this.getPointerPosition(e);
    switch (options.type) {
      case PointerActionType.MOVE:
        this.transform.onPointerMove(point, this.viewBox);
        break;
      case PointerActionType.START:
        this.transform.onPointerDown(point);
        break;
      case PointerActionType.STOP:
        this.transform.onPointerUp();
        break;
      default:
        break;
    }
  }

  private setStrokeProperties(strokeProps: IStrokePropOptions): void {
    this.strokeProps[strokeProps.targetAttr as string] = strokeProps.value;
  }

  private setViexBox(viexBox: IViewBox): void {
    this.viewBox = viexBox;
  }

  private getPointerPosition(e: MouseEvent | WheelEvent): DOMPoint {
    const svgPoint = this.svg.createSVGPoint();
    svgPoint.x = e.clientX;
    svgPoint.y = e.clientY;
    // Null check is done in constructor
    return svgPoint.matrixTransform((this.svg.getScreenCTM() as DOMMatrix).inverse());
  }
}
