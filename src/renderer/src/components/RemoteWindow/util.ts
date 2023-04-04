import { IMouseData, IKeyData, IScrollData } from './type';

export const getMouseData = (event: MouseEvent) => {
  const video = event.target as HTMLVideoElement;
  let button = 'left';
  if (event.buttons === 4) {
    button = 'middle';
  } else if (event.buttons === 2) {
    button = 'right';
  }
  const type = event.type === 'mousedown' ? 'down' : 'up';
  const data: IMouseData = {
    offset: {
      x: event.offsetX,
      y: event.offsetY,
    },
    video: {
      width: video.offsetWidth,
      height: video.offsetHeight,
    },
    type,
    button,
  };
  return data;
};

export const getScrollData = (event: WheelEvent) => {
  const data: IScrollData = {
    deltaX: event.deltaX,
    deltaY: event.deltaY,
  };
  return data;
};

export const getKeyData = (event: KeyboardEvent) => {
  const type = event.type === 'keydown' ? 'down' : 'up';
  const data: IKeyData = {
    key: event.key.toLowerCase(),
    shift: event.shiftKey,
    meta: event.metaKey,
    ctrl: event.ctrlKey,
    alt: event.altKey,
    type,
  };
  return data;
};
