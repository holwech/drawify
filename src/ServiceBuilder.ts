import 'reflect-metadata';
import { container } from 'tsyringe';
import AppState from './State/AppState';

export default class ServiceBuilder {
    public build() {
        let instance = container.resolve<AppState>(AppState);
        return instance;
    }
}