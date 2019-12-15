export default class EditController {
  private svg!: HTMLElement & SVGElement & SVGSVGElement;

  public init(svg: HTMLElement & SVGElement & SVGSVGElement) {
    this.svg = svg;
    // TODO: Move to EventListenerController
    this.svg.addEventListener('click', this.removeElement);
  }

  private removeElement(event: Event): void {
    const ids = (event.target as Element).id;
    console.log(ids);
  }
}
