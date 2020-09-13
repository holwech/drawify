import { IStrokeProps } from '../Interfaces/ActionInterfaces';

export type optionTypes =
  | IStrokeProps;

export interface IModifier {
  target: ModifierTarget;
  options?: optionTypes;
}

export enum ModifierTarget {
  PAN_ON,
  PAN_OFF,
  EDIT_ON,
  EDIT_OFF,
  SET_STROKE_PROPS,
}
