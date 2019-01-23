interface Point {
  x: number;
  y: number;
}

export class SVGDraw {
  private strokeColor = 'black';
  private strokeWidth = '2';
  private bufferSize = '8';
  private svg: HTMLElement;
  private rect: ClientRect;
  private path: SVGPathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  private pathStarted = false;
  private strPath!: string;
  private buffer: Point[] = [];
  private centerX: number;
  private centerY: number;
  private transformMatrix = [1, 0, 0, 1, 0, 0];
  private fnMouseDownDraw: (e: MouseEvent) => void;
  private fnMouseMoveDraw: (e: MouseEvent) => void;
  private fnMouseUpDraw: () => void;

  constructor(svgID: string) {
    this.fnMouseDownDraw = this.mouseDownDraw.bind(this);
    this.fnMouseMoveDraw = this.mouseMoveDraw.bind(this);
    this.fnMouseUpDraw = this.mouseUpDraw.bind(this);
    this.svg = document.getElementById(svgID) as HTMLElement;
    this.rect = this.svg.getBoundingClientRect();
    let viewbox: string[];
    const viewboxElem = this.svg.getAttributeNS(null, 'viewBox');
    if (viewboxElem !== null) {
      viewbox = viewboxElem.split(' ');
    } else {
      throw new Error('The SVG element requires the view box attribute to be set.');
    }
    this.centerX = parseFloat(viewbox[2]) / 2;
    this.centerY = parseFloat(viewbox[3]) / 2;
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

  public pan(dx: number, dy: number) {
      this.transformMatrix[4] += dx;
      this.transformMatrix[5] += dy;
      const newMatrix = 'matrix(' +  this.transformMatrix.join(' ') + ')';
      this.svg.setAttributeNS(null, 'transform', newMatrix);
  }

  public setStrokeProperties(color: string, smoothness: string, width: string) {
    this.bufferSize = smoothness;
    this.strokeColor = color;
    this.strokeWidth = width;
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

  private togglePanEventListeners(toggle: boolean) {
    if (toggle) {
      // svg.addEventListener('mousedown', onPointerDown); // Pressing the mouse
      // svg.addEventListener('mouseup', onPointerUp); // Releasing the mouse
      // svg.addEventListener('mouseleave', onPointerUp); // Mouse gets out of the SVG area
      // svg.addEventListener('mousemove', onPointerMove); // Mouse is moving

      // // Add all touch events listeners fallback
      // svg.addEventListener('touchstart', onPointerDown); // Finger is touching the screen
      // svg.addEventListener('touchend', onPointerUp); // Finger is no longer touching the screen
      // svg.addEventListener('touchmove', onPointerMove); // Finger is moving
    }
  }


  private mouseDownDraw(e: MouseEvent) {
    this.pathStarted = true;
    this.path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    this.path.setAttribute('fill', 'none');
    this.path.setAttribute('stroke', this.strokeColor);
    this.path.setAttribute('stroke-width', this.strokeWidth);
    this.buffer = [];
    const pt: Point = this.getMousePosition(e);
    this.appendToBuffer(pt);
    this.strPath = 'M' + pt.x + ' ' + pt.y;
    this.path.setAttribute('d', this.strPath);
    this.svg.appendChild(this.path);
  }

  private getMousePosition(e: MouseEvent) {
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
