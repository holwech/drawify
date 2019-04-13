import Timer from './timer/Timer';
import { AppStates } from './utils/appInterfaces';
import PlayState from './player/PlayState';

export default class AppState {
  constructor(
    public state = AppStates.PLAYING,
    public timer = new Timer(),
    public playState = new PlayState(timer),
  ) {}
}
