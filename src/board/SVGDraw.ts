import { IStrokeProps, ElementType } from '../utils/boardInterfaces';

export class SVGDraw {
  private path: SVGPathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  private pathStarted = false;
  private strPath!: string;
  private buffer: DOMPoint[] = [];
  private id: string;

  constructor(
    private svg: HTMLElement & SVGElement & SVGSVGElement,
    id: number,
  ) {
    this.id = String(id);
  }

  public onPointerDown(point: DOMPoint, style: IStrokeProps): SVGPathElement {
    this.pathStarted = true;
    this.path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    this.path.setAttribute('fill', 'none');
    this.path.setAttribute('stroke', style['stroke']);
    this.path.setAttribute('stroke-width', String(style['stroke-width']));
    this.path.setAttribute('id', this.id);
    this.path.setAttribute('class', 'svgElement ' + ElementType.PATH);
    if (style.fill) {
      this.path.setAttribute('fill', style['fill']);
    }
    // Keeps stroke width constant, regardless of zoom
    // this.path.setAttribute('vector-effect', 'non-scaling-stroke');
    this.buffer = [];
    this.appendToBuffer(point, style['buffer-size']);
    this.strPath = 'M' + point.x + ' ' + point.y;
    this.path.setAttribute('d', this.strPath);
    // this.svg.appendChild(this.path);
    return this.path;
  }

  public onPointerMove(point: DOMPoint, bufferSize: number): void {
    if (this.pathStarted) {
      this.appendToBuffer(point, bufferSize);
      this.updateSVGPath(bufferSize);
    }
  }

  public onPointerUp(): void {
    // const els = document.getElementsByClassName('svgElement');
    // Array.from(els).forEach((el) => {
    //   el.addEventListener('click', () => {
    //     console.log('click');
    //   });
    // });
    if (this.pathStarted) {
      this.pathStarted = false;
    }
  }

  private appendToBuffer(point: DOMPoint, bufferSize: number): void {
    this.buffer.push(point);
    while (this.buffer.length > bufferSize) {
      this.buffer.shift();
    }
  }

  private getAveragePoint(offset: number, bufferSize: number): null | DOMPoint {
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

  private updateSVGPath(bufferSize: number): void {
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
