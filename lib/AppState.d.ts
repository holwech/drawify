import Timer from './timer/Timer';
import { AppStates } from './utils/appInterfaces';
import PlayState from './player/PlayState';
export default class AppState {
    state: AppStates;
    playState: PlayState;
    timer: Timer;
    constructor(state?: AppStates, playState?: PlayState, timer?: Timer);
}
