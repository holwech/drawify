import { PlayStates } from '../Interfaces/PlayInterfaces';
import { IAction, optionTypes } from '../Interfaces/ActionInterfaces';
import { singleton } from 'tsyringe';

@singleton()
export default class PlayState {
  public log: IAction<optionTypes>[] = [];
  public currIdx = 0;
  public state = PlayStates.PAUSE;
  constructor() {}
}
