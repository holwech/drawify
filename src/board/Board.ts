export class Board {
  constructor(private svg: HTMLElement & SVGElement & SVGSVGElement) {}

  public clear(): void {
    let lastChild = this.svg.lastChild;
    while (lastChild) {
      this.svg.removeChild(lastChild);
      lastChild = this.svg.lastChild;
    }
  }

  public removeElement(id: number): void {
    console.log('removeElement = id: ', id);
    const element = this.svg.getElementById(String(id));
    this.svg.removeChild(element);
  }
}
