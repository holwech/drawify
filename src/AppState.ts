import Timer from './timer/Timer';
import { AppStates } from './utils/appInterfaces';
import PlayState from './player/PlayState';
import EventState from './event/EventState';

export default class AppState {
  constructor(
    public state = AppStates.PAUSE,
    public timer = new Timer(),
    public playState = new PlayState(),
    public eventState = new EventState(0),
  ) {}
}
