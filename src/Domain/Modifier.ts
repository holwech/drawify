export interface IModifier {
  target: ModifierTarget;
}

export enum ModifierTarget {
  PAN_ON,
  PAN_OFF,
  EDIT_ON,
  EDIT_OFF
}
