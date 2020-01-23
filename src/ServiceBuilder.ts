import 'reflect-metadata';
import { container } from 'tsyringe';
import Service from './Controllers/Service';
import AppState from './State/AppState';
import Timer from './timer/Timer';

export default class ServiceBuilder {
  public build(appState?: AppState, timer?: Timer) {
    if (appState != undefined) {
      container.register<AppState>(AppState, { useValue: appState});
    }
    if (timer != undefined) {
      container.register<Timer>(Timer, { useValue: timer});
    }
    return container.resolve<Service>(Service);
  }
}