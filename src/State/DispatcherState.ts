import { ElementClickACtionType } from '../Interfaces/ActionInterfaces';
import { singleton } from 'tsyringe';

@singleton()
export default class DispatcherState {
  public idCount: number = 0;
  public panState: boolean = false;
  public clickTarget = ElementClickACtionType.REMOVE;

  constructor() {}
}
