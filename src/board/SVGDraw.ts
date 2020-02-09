import { IStrokeProps, ElementType } from "../Interfaces/BoardInterfaces";

export class SVGDraw {
  private path: SVGPathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  private pathStarted = false;
  private strPath!: string;
  private buffer: DOMPoint[] = [];
  private id: string;
  private strokeProps: IStrokeProps

  constructor(id: number, strokeProps: IStrokeProps, private scale: number) {
    this.id = String(id);
    this.strokeProps = strokeProps;
  }

  public setStrokeProps(strokeProps: IStrokeProps) {
    this.strokeProps = strokeProps;
  }

  public onPointerDown(point: DOMPoint): SVGPathElement {
    this.pathStarted = true;
    this.path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    this.path.setAttribute('fill', 'none');
    this.path.setAttribute('stroke', this.strokeProps['stroke']);
    this.path.setAttribute('stroke-width', String(this.strokeProps['stroke-width'] * this.scale));
    this.path.setAttribute('id', this.id);
    this.path.setAttribute('class', 'svgElement ' + ElementType.PATH);
    if (this.strokeProps.fill) {
      this.path.setAttribute('fill', this.strokeProps['fill']);
    }
    // Keeps stroke width constant, regardless of zoom
    // this.path.setAttribute('vector-effect', 'non-scaling-stroke');
    this.buffer = [];
    this.appendToBuffer(point, this.strokeProps['buffer-size']);
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
