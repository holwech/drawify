import { PlayStates } from '../Interfaces/PlayInterfaces';
import { IAction } from '../Interfaces/ActionInterfaces';
import { singleton, injectable } from 'tsyringe';

export default class PlayState {
  constructor(
    public log: IAction[] = [],
    public currIdx = 0,
    public state = PlayStates.PAUSE
  ) {}
}
