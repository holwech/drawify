import { PlayStates } from './playInterfaces';
import { IAction } from '../action/ActionInterfaces';
import { singleton } from 'tsyringe';

@singleton()
export default class PlayState {
  constructor(public log: IAction[] = [], public currIdx = 0, public state = PlayStates.PAUSE) {}
}
