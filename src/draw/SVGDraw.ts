interface Point {
  x: number;
  y: number;
}

export class SVGDraw {
  public scale = 1;
  private strokeColor = 'black';
  private strokeWidth = '2';
  private bufferSize = '8';
  private svg: HTMLElement & SVGElement & SVGSVGElement;
  private path: SVGPathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  private pathStarted = false;
  private strPath!: string;
  private buffer: Point[] = [];
  private fnMouseDownDraw: (e: MouseEvent) => void;
  private fnMouseMoveDraw: (e: MouseEvent) => void;
  private fnMouseUpDraw: () => void;

  constructor(svgID: string) {
    this.fnMouseDownDraw = this.mouseDownDraw.bind(this);
    this.fnMouseMoveDraw = this.mouseMoveDraw.bind(this);
    this.fnMouseUpDraw = this.mouseUpDraw.bind(this);
    this.svg = document.getElementById(svgID) as any as HTMLElement & SVGElement & SVGSVGElement;
    this.toggleDrawEventListners(true);
  }

  public togglePanMode(toggle: boolean) {
    if (toggle) {
      this.toggleDrawEventListners(false);
    } else {
      this.toggleDrawEventListners(true);
    }
  }

  public clear() {
    let lastChild = this.svg.lastChild;
    while (lastChild) {
      this.svg.removeChild(lastChild);
      lastChild = this.svg.lastChild;
    }
  }

  public setStrokeProperties(color: string, smoothness: string, width: string, scale: number) {
    this.bufferSize = smoothness;
    this.strokeColor = color;
    console.log(String(Number(width) * scale));
    this.strokeWidth = String(Number(width) * scale);
  }

  public toggleDrawEventListners(toggle: boolean) {
    if (toggle) {
      this.svg.addEventListener('mousedown', this.fnMouseDownDraw);
      this.svg.addEventListener('mousemove', this.fnMouseMoveDraw);
      this.svg.addEventListener('mouseup', this.fnMouseUpDraw);
    } else {
      console.log('listeners off');
      this.svg.removeEventListener('mousedown', this.fnMouseDownDraw);
      this.svg.removeEventListener('mousemove', this.fnMouseMoveDraw);
      this.svg.removeEventListener('mouseup', this.fnMouseUpDraw);
    }
  }

  private mouseDownDraw(e: MouseEvent) {
    this.pathStarted = true;
    this.path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    this.path.setAttribute('fill', 'none');
    this.path.setAttribute('stroke', this.strokeColor);
    this.path.setAttribute('stroke-width', this.strokeWidth);
    this.path.setAttribute('vector-effect', 'non-scaling-stroke');
    this.buffer = [];
    const pt: Point = this.getMousePosition(e);
    this.appendToBuffer(pt);
    this.strPath = 'M' + pt.x + ' ' + pt.y;
    this.path.setAttribute('d', this.strPath);
    this.svg.appendChild(this.path);
  }

  private getMousePosition(e: MouseEvent) {
    const m = this.svg.getScreenCTM();
    const point = this.svg.createSVGPoint();

    point.x = e.clientX;
    point.y = e.clientY;
    if (m) {
      return point.matrixTransform(m.inverse());
    } else {
      throw new Error('m variable is not defined in getPointFromViewBox in Transform');
    }
  }

  private appendToBuffer(pt: Point) {
    this.buffer.push(pt);
    while (this.buffer.length > Number(this.bufferSize)) {
      this.buffer.shift();
    }
  }

  private mouseMoveDraw(e: MouseEvent) {
    if (this.pathStarted) {
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
    let pt: Point | null = this.getAveragePoint(0);
    if (pt) {
      this.strPath += ' L' + pt!.x + ' ' + pt!.y;
      let tempPath = '';
      for (let offset = 2; offset < this.buffer.length; offset += 2) {
        pt = this.getAveragePoint(offset);
        tempPath += ' L' + pt!.x + ' ' + pt!.y;
      }
      this.path.setAttribute('d', this.strPath + tempPath);
    }
  }

  private mouseUpDraw() {
    if (this.pathStarted) {
      this.pathStarted = false;
    }
  }
}
