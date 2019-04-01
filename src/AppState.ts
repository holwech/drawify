import Timer from './utils/Timer';
import { AppStates } from './utils/appInterfaces';
import PlayState from './player/PlayState';

export default class AppState {
  constructor(
    public state = AppStates.UINIT,
    public playState = new PlayState(),
    public timer = new Timer(),
  ) {

  }
}
