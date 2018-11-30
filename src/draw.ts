interface Point {
  x: number;
  y: number;
}

export class SVGDraw {
  private strokeWidth: string;
  private bufferSize: string;
  private svg: SVGElement;
  private rect: ClientRect;
  private path: SVGPathElement;
  private strPath: string;
  private buffer: Point[];

  constructor(svgID: string) {
    this.strokeWidth = '2';
    this.bufferSize = (document.getElementById('cmbBufferSize') as HTMLInputElement).value;
    this.path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    this.path.setAttribute('fill', 'none');
    this.path.setAttribute('stroke', '#000');
    this.path.setAttribute('stroke-width', this.strokeWidth);
    this.buffer = [];
    this.rect = this.svg.getBoundingClientRect();

    this.svg.addEventListener('mousedown', (e: MouseEvent) => this.mouseDownDraw(e));
    this.svg.addEventListener('mousemove', (e: MouseEvent) => this.mouseMoveDraw(e));
    this.svg.addEventListener('mouseup', () => this.mouseUpDraw());
  }

  private mouseDownDraw(e: MouseEvent) {
    const pt: Point = this.getMousePosition(e);
    this.appendToBuffer(pt);
    this.strPath = 'M' + pt.x + ' ' + pt.y;
    this.path.setAttribute('d', this.strPath);
    this.svg.appendChild(this.path);
  }

  private getMousePosition(e) {
    return {
      x: e.pageX - this.rect.left,
      y: e.pageY - this.rect.top,
    };
  }

  private appendToBuffer(pt: Point) {
    this.buffer.push(pt);
    while (this.buffer.length > Number(this.bufferSize)) {
      this.buffer.shift();
    }
  }

  private mouseMoveDraw(e: MouseEvent) {
    if (this.path) {
      this.appendToBuffer(this.getMousePosition(e));
      this.updateSVGPath();
    }
  }

  private getAveragePoint(offset: number) {
    const len = this.buffer.length;
    if (len % 2 === 1 || len >= Number(this.bufferSize)) {
      let totalX = 0;
      let totalY = 0;
      let pt: Point = {
        x: 0,
        y: 0,
      };
      let count = 0;
      for (let i = offset; i < len; i++) {
        count++;
        pt = this.buffer[i];
        totalX += pt.x;
        totalY += pt.y;
      }
      return {
        x: totalX / count,
        y: totalY / count,
      };
    }
    return null;
  }

  private updateSVGPath() {
    let pt: Point = this.getAveragePoint(0);
    if (pt) {
      this.strPath += ' L' + pt.x + ' ' + pt.y;
      let tempPath = '';
      for (let offset = 2; offset < this.buffer.length; offset += 2) {
        pt = this.getAveragePoint(offset);
        tempPath += ' L' + pt.x + ' ' + pt.y;
      }
      this.path.setAttribute('d', this.strPath + tempPath);
    }
  }

  private mouseUpDraw() {
    if (this.path) {
      this.path = null;
    }
  }
}