import Timer from './timer/Timer';
import { AppStates, AppSubState } from './utils/appInterfaces';
import PlayState from './player/PlayState';

export default class AppState {
  constructor(
    public state = AppStates.PLAYING,
    public subState = AppSubState.PAUSE,
    public timer = new Timer(),
    public playState = new PlayState(timer),
  ) {}
}
