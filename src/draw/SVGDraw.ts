import { IStrokeStyle } from './interfaces';

export class SVGDraw {
  private svg: HTMLElement & SVGElement & SVGSVGElement;
  private path: SVGPathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  private pathStarted = false;
  private strPath!: string;
  private buffer: DOMPoint[] = [];

  constructor(svgID: string) {
    this.svg = document.getElementById(svgID) as any as HTMLElement & SVGElement & SVGSVGElement;
  }

  public clear() {
    let lastChild = this.svg.lastChild;
    while (lastChild) {
      this.svg.removeChild(lastChild);
      lastChild = this.svg.lastChild;
    }
  }

  public onPointerDown(point: DOMPoint, style: IStrokeStyle) {
    this.pathStarted = true;
    this.path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    this.path.setAttribute('fill', 'none');
    this.path.setAttribute('stroke', style.color);
    this.path.setAttribute('stroke-width', String(style.width));
    // Keeps stroke width constant, regardless of zoom
    // this.path.setAttribute('vector-effect', 'non-scaling-stroke');
    this.buffer = [];
    this.appendToBuffer(point, style.bufferSize);
    this.strPath = 'M' + point.x + ' ' + point.y;
    this.path.setAttribute('d', this.strPath);
    this.svg.appendChild(this.path);
  }

  public onPointerMove(point: DOMPoint, bufferSize: number) {
    if (this.pathStarted) {
      this.appendToBuffer(point, bufferSize);
      this.updateSVGPath(bufferSize);
    }
  }

  public onPointerUp() {
    if (this.pathStarted) {
      this.pathStarted = false;
    }
  }

  private appendToBuffer(point: DOMPoint, bufferSize: number) {
    this.buffer.push(point);
    while (this.buffer.length > bufferSize) {
      this.buffer.shift();
    }
  }

  private getAveragePoint(offset: number, bufferSize: number) {
    const len = this.buffer.length;
    if (len % 2 === 1 || len >= bufferSize) {
      let totalX = 0;
      let totalY = 0;
      let point: DOMPoint = new DOMPoint();
      let count = 0;
      for (let i = offset; i < len; i++) {
        count++;
        point = this.buffer[i];
        totalX += point.x;
        totalY += point.y;
      }
      return new DOMPoint(totalX / count, totalY / count);
    }
    return null;
  }

  private updateSVGPath(bufferSize: number) {
    let point: DOMPoint | null = this.getAveragePoint(0, bufferSize);
    if (point) {
      this.strPath += ' L' + point!.x + ' ' + point!.y;
      let tempPath = '';
      for (let offset = 2; offset < this.buffer.length; offset += 2) {
        point = this.getAveragePoint(offset, bufferSize);
        tempPath += ' L' + point!.x + ' ' + point!.y;
      }
      this.path.setAttribute('d', this.strPath + tempPath);
    }
  }

}
