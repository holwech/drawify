import { BoardState } from '../utils/boardInterfaces';

export default class EventState {
  constructor(
    public idCount: number,
    public boardState: BoardState = BoardState.DRAW,
    ) {}
}
