export interface IMouseClickData {
  offset: {
    x: number,
    y: number,
  },
  video: {
    width: number,
    height: number,
  },
  screen: {
    width: number,
    height: number,
  }
}

export interface IScrollData {
  deltaX: number,
  deltaY: number,
}

export interface IKeyDownData {
  key: string,
  meta: boolean,
  alt: boolean,
  ctrl: boolean,
  shift: boolean,
}
