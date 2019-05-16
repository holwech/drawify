import { EventType } from './appInterfaces';

export interface IRecordPoint {
  time: number;
  x: number;
  y: number;
}

export interface IPoint {
  x: number;
  y: number;
}

export interface IStrokeProps {
  color: string;
  width: number;
  bufferSize: number;
  fill: string | undefined;
}

export interface IViewBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface IEvent {
  eventType: EventType;
  isEdit?: boolean;
  time?: number;
  id?: number;
  e?: MouseEvent | WheelEvent;
  strokeProps?: IStrokeProps;
  state?: BoardState;
  viewBox?: IViewBox;
}

export interface ILogEvent {
  event: IEvent;
  time: number;
  id: number;
}

export enum EventOrigin {
  USER,
  PLAYER,
}

export enum BoardState {
  DRAW = 'DRAW',
  PAN = 'PAN',
}

export enum ElementType {
  PATH = 'path'
}