interface drawPoint {
    x: 
}

class Line {
    id: string;
    start_time: Date;
    drawPoints: number[];
}

export class Logger {
  private drawLog!: number[][][];

  constructor(canvasID: string) {
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