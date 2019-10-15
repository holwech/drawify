export default class EditController {
  constructor(
    private svg: HTMLElement & SVGElement & SVGSVGElement,
  ) {
    this.svg.addEventListener('click', this.removeElement);
  }

  private removeElement(event: Event): void {
    const ids = (event.target as Element).id;
    console.log(ids);
  }
}