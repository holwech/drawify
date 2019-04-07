import Timer from '../timer/Timer';
import { PlayStates } from './playInterfaces';
import { IEvent } from '../utils/boardInterfaces';
export default class PlayState {
    timer: Timer;
    log: IEvent[];
    currIdx: number;
    state: PlayStates;
    constructor(timer?: Timer, log?: IEvent[], currIdx?: number, state?: PlayStates);
}
