import { PlayStates } from '../Interfaces/PlayInterfaces';
import { IAction } from '../Interfaces/ActionInterfaces';
import { singleton } from 'tsyringe';

@singleton()
export default class PlayState {
  public log: IAction[] = [];
  public currIdx = 0;
  public state = PlayStates.PAUSE;
  constructor() {}
}
