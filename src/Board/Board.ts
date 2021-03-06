import { singleton } from 'tsyringe';
import { SVG } from '../Interfaces/AppInterfaces';

@singleton()
export class Board {
  private svg!: SVG;

  constructor(svgElement: HTMLElement) {
    this.svg = (svgElement as any) as SVG;
  }

  public clear(): void {
    let lastChild = this.svg.lastChild;
    while (lastChild) {
      this.svg.removeChild(lastChild);
      lastChild = this.svg.lastChild;
    }
  }

  public test(): void {
    console.log(this.svg);
  }

  public removeElement(id: number): void {
    console.log('removeElement = id: ', id);
    const element = this.svg.getElementById(String(id));
    this.svg.removeChild(element);
  }
}
