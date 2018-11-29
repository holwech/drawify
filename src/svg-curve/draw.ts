export class Canvas {
  private strokeWidth: number;
  private bufferSize: string;
  private svg: SVGElement;
  private rect: ?;
  private path: SVGPathElement;
  private strPath: string;
  private buffer: number[];

  constructor(svgID: string) {
    this.strokeWidth = 2;
    this.bufferSize = (document.getElementById('cmbBufferSize') as HTMLInputElement).value;
    this.path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    this.path.setAttribute('fill', 'none');
    this.path.setAttribute('stroke', '#000');


    this.drawLog = [];
    this.canvas = document.getElementById(canvasID) as HTMLCanvasElement;
    this.context = this.canvas.getContext('2d') as CanvasRenderingContext2D;
    this.canvas.addEventListener('mousedown', (e: MouseEvent) => this.mouseDownDraw(e));
    this.canvas.addEventListener('mousemove', (e: MouseEvent) => this.mouseMoveDraw(e));
    this.canvas.addEventListener('mouseup', () => this.mouseUpDraw());
    this.canvas.addEventListener('mouseleave', () => this.mouseLeaveDraw());
  }

  public clear() {
    this.context.setTransform(1, 0, 0, 1, 0, 0);
    this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
  }

  public test() {
    console.log('Test!');
  }

  private mouseDownDraw(e: MouseEvent) {
    this.mousePressed = true;
    const offsetX = e.pageX - this.canvas.offsetLeft;
    const offsetY = e.pageY - this.canvas.offsetTop;
    this.draw(offsetX, offsetY, false);
  }

  private mouseMoveDraw(e: MouseEvent) {
    if (this.mousePressed) {
      const offsetX = e.pageX - this.canvas.offsetLeft;
      const offsetY = e.pageY - this.canvas.offsetTop;
      this.draw(offsetX, offsetY, true);
    }
  }

  private mouseUpDraw() {
    this.mousePressed = false;
  }

  private mouseLeaveDraw() {
    this.mousePressed = false;
  }


  private draw(x: number, y: number, isDown: boolean) {
    if (isDown) {
        this.context.beginPath();
        this.context.strokeStyle = 'black';
        this.context.lineWidth = 2;
        this.context.lineJoin = 'round';
        this.context.moveTo(this.lastX, this.lastY);
        this.context.lineTo(x, y);
        this.context.closePath();
        this.context.stroke();
    }
    this.lastX = x; this.lastY = y;
  }
}
