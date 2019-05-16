import { BoardState } from '../utils/boardInterfaces';

enum DrawType {
  DRAW_START = 'DRAW_START',
  DRAW_STOP = 'DRAW_STOP',
  DRAW_MOVE = 'DRAW_MOVE',
}

enum Targets {
  DRAW = 'DRAW',
  PAN = 'PAN',
  ZOOM = 'ZOOM',
  STROKE_PROP = 'STROKE_PROPS',

}

export interface IAction {
  id: number,
  time: number,
  actionType: DrawType | BoardState
}