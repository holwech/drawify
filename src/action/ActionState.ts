import { ElementClickACtionType } from './ActionInterfaces';
import { singleton } from 'tsyringe';

@singleton()
export default class ActionState {
  constructor(
    public idCount: number,
    public panState: boolean = false,
    public clickTarget = ElementClickACtionType.REMOVE,
  ) {}
}
