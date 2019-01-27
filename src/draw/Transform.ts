interface Point {
  x: number;
  y: number;
}

export class Transform {
  public scale = 1;
  public scaleSpeed = 1;
  private svg: SVGElement & SVGElement & SVGSVGElement;
  private isPointerDown = false;
  private pointerOrigin: Point = { x: 0, y: 0 };
  private viewBox = { x: 0, y: 0, width: 500, height: 500 };
  private newViewBox = { x: 0, y: 0 };
  private ratio: number;
  private fnOnPointerDown: (e: MouseEvent | TouchEvent) => void;
  private fnOnPointerUp: (e: MouseEvent | TouchEvent) => void;
  private fnOnPointerMove: (e: MouseEvent | TouchEvent) => void;
  private fnSetRatio: () => void;
  constructor(svgID: string) {
    this.fnOnPointerDown = this.onPointerDown.bind(this);
    this.fnOnPointerUp = this.onPointerUp.bind(this);
    this.fnOnPointerMove = this.onPointerMove.bind(this);
    this.fnSetRatio = this.setRatio.bind(this);
    this.svg = document.getElementById(svgID) as any as SVGElement & SVGSVGElement & HTMLElement;
    const viewboxElem = this.svg.getAttributeNS(null, 'viewBox');
    if (viewboxElem !== null) {
      const arr = viewboxElem.split(' ').map(Number);
      this.viewBox = { x: arr[0], y: arr[1], width: arr[2], height: arr[3] };
    } else {
      throw new Error('The SVG element requires the view box attribute to be set.');
    }
    this.ratio = this.viewBox.width / this.svg.getBoundingClientRect().width;
    this.togglePanEventListeners(false);
  }

  public togglePanEventListeners(toggle: boolean) {
    if (toggle) {
      this.svg.addEventListener('resize', this.fnSetRatio);

      this.svg.addEventListener('mousedown', this.fnOnPointerDown); // Pressing the mouse
      this.svg.addEventListener('mouseup', this.fnOnPointerUp); // Releasing the mouse
      this.svg.addEventListener('mouseleave', this.fnOnPointerUp); // Mouse gets out of the this.svg area
      this.svg.addEventListener('mousemove', this.fnOnPointerMove); // Mouse is moving

      this.svg.addEventListener('touchstart', this.fnOnPointerDown); // Finger is touching the screen
      this.svg.addEventListener('touchend', this.fnOnPointerUp); // Finger is no longer touching the screen
      this.svg.addEventListener('touchmove', this.fnOnPointerMove); // Finger is moving
    } else {
      this.svg.removeEventListener('resize', this.fnSetRatio);

      this.svg.removeEventListener('mousedown', this.fnOnPointerDown); // Pressing the mouse
      this.svg.removeEventListener('mouseup', this.fnOnPointerUp); // Releasing the mouse
      this.svg.removeEventListener('mouseleave', this.fnOnPointerUp); // Mouse gets out of the this.svg area
      this.svg.removeEventListener('mousemove', this.fnOnPointerMove); // Mouse is moving

      // Add all touch events listeners fallback
      this.svg.removeEventListener('touchstart', this.fnOnPointerDown); // Finger is touching the screen
      this.svg.removeEventListener('touchend', this.fnOnPointerUp); // Finger is no longer touching the screen
      this.svg.removeEventListener('touchmove', this.fnOnPointerMove); // Finger is moving
    }
  }

  public setZoom(e: WheelEvent) {
    const mousePosition = this.getPointFromViewBox(e);
    this.viewBox.x = mousePosition.x + (this.viewBox.x - mousePosition.x) * this.scale;
    this.viewBox.y = mousePosition.y + (this.viewBox.y - mousePosition.y) * this.scale;
    this.viewBox.width = this.viewBox.width * this.scale;
    this.viewBox.height = this.viewBox.height * this.scale;
    const viewBoxString = `${this.viewBox.x} ${this.viewBox.y} ${this.viewBox.width} ${this.viewBox.height}`;
    this.scale *= this.scale;
    this.svg.setAttribute('viewBox', viewBoxString);
  }

  private setRatio() {
    this.ratio = this.viewBox.width / this.svg.getBoundingClientRect().width;
  }

  private onPointerDown(e: TouchEvent | MouseEvent) {
    this.isPointerDown = true;
    this.pointerOrigin = this.getPointFromEvent(e);
  }

  private onPointerUp() {
    this.isPointerDown = false;
    this.viewBox.x = this.newViewBox.x;
    this.viewBox.y = this.newViewBox.y;
  }

  private onPointerMove(e: TouchEvent | MouseEvent) {
    if (!this.isPointerDown) {
      return;
    }
    e.preventDefault();

    const pointerPosition = this.getPointFromEvent(e);
    this.newViewBox.x = this.viewBox.x - (pointerPosition.x - this.pointerOrigin.x) * this.ratio * this.scale;
    this.newViewBox.y = this.viewBox.y - (pointerPosition.y - this.pointerOrigin.y) * this.ratio * this.scale;
    const viewBoxString = `${this.newViewBox.x} ${this.newViewBox.y} ${this.viewBox.width} ${this.viewBox.height}`;
    this.svg.setAttribute('viewBox', viewBoxString);
  }

  private getPointFromViewBox(e: WheelEvent) {
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


  private getPointFromEvent(e: TouchEvent | MouseEvent | WheelEvent) {
    const point: Point = {x: 0, y: 0};
    if ((window as any).TouchEvent && e instanceof TouchEvent) {
      point.x = e.targetTouches[0].clientX;
      point.y = e.targetTouches[0].clientY;
    } else if (e instanceof MouseEvent || e instanceof WheelEvent) {
      point.x = e.clientX;
      point.y = e.clientY;
    }
    return point;
  }
}
