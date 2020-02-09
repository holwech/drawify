import { AppStates } from '../Interfaces/AppInterfaces';
import PlayState from './PlayState';
import DispatcherState from './DispatcherState';
import { injectable } from 'tsyringe';

@injectable()
export default class AppState {
  public state = AppStates.PAUSE;

  constructor(
    public playState: PlayState = new PlayState(),
    public dispatcherState: DispatcherState = new DispatcherState(),
  ) {}
}
