import { singleton } from "tsyringe";
import { SVG } from "../Interfaces/AppInterfaces";

@singleton()
export default class EditController {
  private svg!: SVG;

  constructor(svgElement: HTMLElement) {
    this.svg = svgElement as any as SVG;
    this.svg.addEventListener('click', this.removeElement);
  }

  private removeElement(event: Event): void {
    const ids = (event.target as Element).id;
    console.log(ids);
  }
}
