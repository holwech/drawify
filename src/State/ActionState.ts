import { ElementClickACtionType } from './../Interfaces/ActionInterfaces';

export default class ActionState {
  public idCount: number = 0;
  public panState: boolean = false;
  public clickTarget = ElementClickACtionType.REMOVE;
  constructor() {}
}
