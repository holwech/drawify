import { IViewBox } from '../Interfaces/BoardInterfaces';
import { singleton } from 'tsyringe';
import { SVG } from '../Interfaces/AppInterfaces';

@singleton()
export class Transform {
  private isPointerDown = false;
  private pointerOrigin?: DOMPoint;
  private svg!: SVG;

  constructor(svgElement: HTMLElement) {
    this.svg = svgElement as any as SVG
  }

  public zoom(point: DOMPoint, viewBox: IViewBox, modifier: number): void {
    viewBox.x = point.x + (viewBox.x - point.x) * modifier;
    viewBox.y = point.y + (viewBox.y - point.y) * modifier;
    viewBox.width = viewBox.width * modifier;
    viewBox.height = viewBox.height * modifier;
    const viewBoxString = `${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`;
    this.svg.setAttribute('viewBox', viewBoxString);
  }

  public onPointerDown(point: DOMPoint): void {
    this.isPointerDown = true;
    this.pointerOrigin = point;
  }

  public onPointerUp(): void {
    this.isPointerDown = false;
  }

  public onPointerMove(point: DOMPoint, viewBox: IViewBox): void {
    if (!this.isPointerDown) {
      return;
    }
    viewBox.x = viewBox.x - (point.x - this.pointerOrigin!.x);
    viewBox.y = viewBox.y - (point.y - this.pointerOrigin!.y);
    const viewBoxString = `${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`;
    this.svg.setAttribute('viewBox', viewBoxString);
  }
}
