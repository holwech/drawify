import { SVGDraw } from '../Board/SVGDraw';
import { Transform } from '../Board/Transform';
import { IViewBox } from '../Interfaces/BoardInterfaces';
import { Board } from '../Board/Board';
import {
  IAction,
  Targets,
  IDrawOptions,
  PointerActionType,
  IPanOptions,
  IZoomOptions,
  IClickOptions,
  ElementClickActionType,
  IPointerEvent,
} from '../Interfaces/ActionInterfaces';
import { SVG } from '../Interfaces/AppInterfaces';
import { singleton } from 'tsyringe';
import Dispatcher from './Dispatcher';

const SCALE_FACTOR = 0.05;

@singleton()
export class BoardController {
  // State properties
  private scale = 1;
  private viewBoxInit = {
    x: 0,
    y: 0,
    width: 1200,
    height: 800,
  };
  private viewBox: IViewBox = this.viewBoxInit;
  private drawers: SVGDraw[] = [];
  private elementBuffer: SVGPathElement[] = [];
  private svg!: SVG;

  constructor(dispatcher: Dispatcher, private board: Board, private transform: Transform, svgElement: HTMLElement) {
    this.svg = (svgElement as any) as SVG;
    dispatcher.onAction(this.execute.bind(this));
    this.svg.setAttribute(
      'viewBox',
      `${this.viewBoxInit.x} ${this.viewBoxInit.y} ${this.viewBoxInit.width} ${this.viewBoxInit.height}`,
    );
    this.svg.setAttribute('perserveAspectRatio', 'xMinYMin meet');
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
      case Targets.PREDRAW:
        this.predraw();
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
    this.elementBuffer.forEach(el => {
      this.svg.appendChild(el);
    });
    this.elementBuffer = [];
  }

  private click(options: IClickOptions): void {
    const e = options.event;
    switch (options.type) {
      case ElementClickActionType.REMOVE:
        const id = Number(e.id);
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
    const modifier = e.deltaY > 0 ? 1 + SCALE_FACTOR : 1 - SCALE_FACTOR;
    const point = this.getPointerPosition(e);
    this.transform.zoom(point, this.viewBox, modifier);
    this.scale = this.viewBox.width / this.viewBoxInit.width;
  }

  private draw(action: IAction, options: IDrawOptions): void {
    const e = options.event;
    const point = this.getPointerPosition(e);
    switch (options.type) {
      case PointerActionType.MOVE:
        this.drawers[action.id!].onPointerMove(point, options.strokeProps['buffer-size']);
        break;
      case PointerActionType.START:
        this.drawers[action.id!] = new SVGDraw(action.id!, options.strokeProps, this.scale);
        const path = this.drawers[action.id!].onPointerDown(point);
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


  private setViexBox(viexBox: IViewBox): void {
    this.viewBox = viexBox;
    this.scale = this.viewBox.width / this.viewBoxInit.width;
  }

  private getPointerPosition(e: IPointerEvent): DOMPoint {
    const svgPoint = this.svg.createSVGPoint();
    svgPoint.x = e.clientX;
    svgPoint.y = e.clientY;
    // Null check is done in constructor
    return svgPoint.matrixTransform((this.svg.getScreenCTM() as DOMMatrix).inverse());
  }
}
