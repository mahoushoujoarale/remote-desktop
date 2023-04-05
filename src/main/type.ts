export interface IMouseData {
  offset: {
    x: number;
    y: number;
  };
  video: {
    width: number;
    height: number;
  };
  type: string;
  button: string;
  isDrag: boolean;
}

export interface IScrollData {
  delta: {
    deltaX: number;
    deltaY: number;
  };
  screen: {
    width: number;
    height: number;
  };
}

export interface IKeyData {
  key: string;
  meta: boolean;
  alt: boolean;
  ctrl: boolean;
  shift: boolean;
  type: string;
}
