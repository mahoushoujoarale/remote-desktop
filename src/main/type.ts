export enum RobotType {
  Mouse,
  KeyBoard,
};

export interface IMouseData {
  offset: {
    x: number,
    y: number,
  },
  screen: {
    width: number,
    height: number,
  },
  video: {
    width: number,
    height: number,
  },
}

export interface IKeyboardData {
  key: string,
  meta: boolean,
  alt: boolean,
  ctrl: boolean,
  shift: boolean,
}
