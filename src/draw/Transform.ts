import { IPoint } from './interfaces';

export class Transform {
  public scaleSpeed = 1;
  private svg: SVGElement & SVGElement & SVGSVGElement;
  private isPointerDown = false;
  private pointerOrigin: IPoint = { x: 0, y: 0 };
  private viewBox = { x: 0, y: 0, width: 500, height: 500 };
  private newViewBox = { x: 0, y: 0 };
  constructor(svgID: string) {
    this.svg = document.getElementById(svgID) as any as SVGElement & SVGSVGElement & HTMLElement;
    const viewboxElem = this.svg.getAttributeNS(null, 'viewBox');
    if (viewboxElem !== null) {
      const arr = viewboxElem.split(' ').map(Number);
      this.viewBox = { x: arr[0], y: arr[1], width: arr[2], height: arr[3] };
    } else {
      throw new Error('The SVG element requires the view box attribute to be set.');
    }
  }

  public onWheel(point: IPoint, scale: number) {
    this.viewBox.x = point.x + (this.viewBox.x - point.x) * scale;
    this.viewBox.y = point.y + (this.viewBox.y - point.y) * scale;
    this.viewBox.width = this.viewBox.width * scale;
    this.viewBox.height = this.viewBox.height * scale;
    const viewBoxString = `${this.viewBox.x} ${this.viewBox.y} ${this.viewBox.width} ${this.viewBox.height}`;
    this.svg.setAttribute('viewBox', viewBoxString);
  }

  public onPointerDown(point: IPoint) {
    this.isPointerDown = true;
    this.pointerOrigin = point;
  }

  public onPointerUp() {
    this.isPointerDown = false;
  }

  public onPointerMove(point: IPoint, scale: number) {
    if (!this.isPointerDown) {
      return;
    }

    this.newViewBox.x = this.viewBox.x - (point.x - this.pointerOrigin.x) * scale;
    this.newViewBox.y = this.viewBox.y - (point.y - this.pointerOrigin.y) * scale;
    const viewBoxString = `${this.newViewBox.x} ${this.newViewBox.y} ${this.viewBox.width} ${this.viewBox.height}`;
    this.svg.setAttribute('viewBox', viewBoxString);
    this.viewBox.x = this.newViewBox.x;
    this.viewBox.y = this.newViewBox.y;
  }
}
