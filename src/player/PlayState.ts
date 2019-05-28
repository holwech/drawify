import { PlayStates } from './playInterfaces';
import { IAction } from '../event/eventInterfaces';

export default class PlayState {
  constructor(
    public log: IAction[] = [],
    public currIdx = 0,
    public state = PlayStates.PAUSE
  ) {}
}
