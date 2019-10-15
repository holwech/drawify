import { IEvent } from './appInterfaces';

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
  [key:string]: any;
  'stroke': string;
  'stroke-width': number;
  'buffer-size': number;
  'fill': string | undefined;
}

export interface IViewBox {
  x: number;
  y: number;
  width: number;
  height: number;
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