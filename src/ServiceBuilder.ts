import 'reflect-metadata';
import { container } from 'tsyringe';
import Service from './Controllers/Service';
import AppState from './State/AppState';
import Timer from './Timer/Timer';
import { SVG } from './Interfaces/AppInterfaces';

export default class ServiceBuilder {
  public build(svgElement: HTMLElement, appState?: AppState, timer?: Timer) {
    if (!(svgElement as SVG).getScreenCTM()) {
      throw new Error('getScreenCTM is not defined');
    }
    container.register<HTMLElement>(HTMLElement, { useValue: svgElement });
    if (timer != undefined) {
      container.register<Timer>(Timer, { useValue: timer });
    }
    if (appState != undefined) {
      container.register<AppState>(AppState, { useValue: appState });
    }
    return container.resolve<Service>(Service);
  }

  public getContainer() {
    return container;
  }
}
