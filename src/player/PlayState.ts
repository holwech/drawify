import { PlayStates } from './playInterfaces';
import { IAction } from '../action/ActionInterfaces';

export default class PlayState {
  constructor(
    public log: IAction[] = [],
    public currIdx = 0,
    public state = PlayStates.PAUSE
  ) {}
}
