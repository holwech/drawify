import { IViewBox } from '../Interfaces/BoardInterfaces';
import { singleton } from 'tsyringe';

@singleton()
export class Transform {
  private isPointerDown = false;
  private pointerOrigin: DOMPoint = new DOMPoint();
  private svg!: HTMLElement & SVGElement & SVGSVGElement;

  public init(svg: HTMLElement & SVGElement & SVGSVGElement) {
    this.svg = svg;
  }

  public zoom(point: DOMPoint, viewBox: IViewBox, scale: number): void {
    viewBox.x = point.x + (viewBox.x - point.x) * scale;
    viewBox.y = point.y + (viewBox.y - point.y) * scale;
    viewBox.width = viewBox.width * scale;
    viewBox.height = viewBox.height * scale;
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
    viewBox.x = viewBox.x - (point.x - this.pointerOrigin.x);
    viewBox.y = viewBox.y - (point.y - this.pointerOrigin.y);
    const viewBoxString = `${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`;
    this.svg.setAttribute('viewBox', viewBoxString);
  }
}
