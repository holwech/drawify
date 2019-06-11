import { ElementClickACtionType } from './ActionInterfaces';

export default class ActionState {
  constructor(
    public idCount: number,
    public panState: boolean = false,
    public clickTarget = ElementClickACtionType.REMOVE,
  ) {}
}
