import Timer from '../timer/Timer';
import { AppStates } from '../Interfaces/AppInterfaces';
import PlayState from './PlayState';
import ActionState from '../State/ActionState';
import { injectable } from 'tsyringe';

@injectable()
export default class AppState {
  public state = AppStates.PAUSE;

  constructor(
    public timer: Timer,
    public playState: PlayState,
    public eventState: ActionState
  ) {}
}
