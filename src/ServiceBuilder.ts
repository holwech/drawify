import 'reflect-metadata';
import { container, isValueProvider, DependencyContainer } from 'tsyringe';
import Service from './Controllers/Service';
import AppState from './State/AppState';
import Timer from './Timer/Timer';
import { SVG } from './Interfaces/AppInterfaces';

export default class ServiceBuilder {
  public build(svgElement: HTMLElement, appState?: AppState, timer?: Timer) {
    if (!(svgElement as SVG).getScreenCTM()) {
      throw new Error('getScreenCTM is not defined');
    }
    this.clearContainerInstances(container);
    container.register<HTMLElement>(HTMLElement, { useValue: svgElement });
    if (timer != undefined) {
      container.register<Timer>(Timer, { useValue: timer });
      container.registerInstance;
    }
    if (appState != undefined) {
      container.register<AppState>(AppState, { useValue: appState });
    }
    return container.resolve<Service>(Service);
  }

  private clearContainerInstances(container: DependencyContainer): void {
    const registry = (container as any)._registry;

    for (const [token, registrations] of registry.entries()) {
      registry.setAll(
        token,
        (registrations as any[])
          // Clear instances
          .map(registration => {
            registration.instance = undefined;
            return registration;
          }),
      );
    }
  }

  public getContainer() {
    return container;
  }
}
