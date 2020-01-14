import { ElementClickACtionType } from './../Interfaces/ActionInterfaces';
import { singleton } from 'tsyringe';

@singleton()
export default class ActionState {
  public idCount: number = 0;
  public panState: boolean = false;
  public clickTarget = ElementClickACtionType.REMOVE;

  constructor() {}
}
