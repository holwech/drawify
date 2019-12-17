import Timer from '../timer/Timer';
import { AppStates } from '../Interfaces/AppInterfaces';
import PlayState from './PlayState';
import EventState from '../State/ActionState';
import { injectable } from 'tsyringe';

@injectable()
export default class AppState {
  public state = AppStates.PAUSE;

  constructor(
    public timer = new Timer(),
    public playState = new PlayState(),
    public eventState = new EventState(),
  ) {}
}
