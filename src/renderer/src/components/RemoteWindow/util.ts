import { IMouseData, IKeyData, IScrollData } from './type';

export const getMouseData = (event: MouseEvent) => {
  const video = event.target as HTMLVideoElement;
  let button = 'left';
  if (event.buttons === 4) {
    button = 'middle';
  } else if (event.buttons === 2) {
    button = 'right';
  }
  let type = 'down';
  if (event.type === 'mouseup') {
    type = 'up';
  } else if (event.type === 'mousemove') {
    type = 'move';
  }
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
    isDrag: false,
  };
  return data;
};

export const getScrollData = (event: WheelEvent) => {
  const video = event.target as HTMLVideoElement;
  const data: IScrollData = {
    delta: {
      deltaX: event.deltaX,
      deltaY: event.deltaY,
    },
    video: {
      width: video.offsetWidth,
      height: video.offsetHeight,
    },
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

export const getTouchData = (event: TouchEvent, deltaX: number, deltaY: number) => {
  const video = event.target as HTMLVideoElement;
  const data: IScrollData = {
    delta: {
      deltaX,
      deltaY,
    },
    video: {
      width: video.offsetWidth,
      height: video.offsetHeight,
    },
  };
  return data;
};
