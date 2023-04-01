
export interface IMouseData {
  offset: {
    x: number,
    y: number,
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
