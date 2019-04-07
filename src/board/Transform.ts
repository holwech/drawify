import { IViewBox } from '../utils/boardInterfaces';

export class Transform {
  private svg: SVGElement & SVGElement & SVGSVGElement;
  private isPointerDown = false;
  private pointerOrigin: DOMPoint = new DOMPoint();

  constructor(svgElement: SVGElement & SVGElement & SVGSVGElement) {
    this.svg = svgElement;
  }

  public onWheel(point: DOMPoint, viewBox: IViewBox, scale: number): void {
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
