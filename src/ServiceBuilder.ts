import 'reflect-metadata';
import { container } from 'tsyringe';
import Service from './Controllers/Service';

export default class ServiceBuilder {
  public build() {
    let instance = container.resolve<Service>(Service);
    return instance;
  }
}