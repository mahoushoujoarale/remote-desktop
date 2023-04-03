import { IMouseClickData, IKeyDownData, IScrollData } from "./type";

export const getMouseClickData = (event: MouseEvent) => {
  const video = event.target as HTMLVideoElement;
  const data: IMouseClickData = {
    offset: {
      x: event.offsetX,
      y: event.offsetY,
    },
    video: {
      width: video.offsetWidth,
      height: video.offsetHeight,
    },
  };
  return data;
};

export const getScrollData = (event: WheelEvent) => {
  const data: IScrollData = {
    deltaX: event.deltaX,
    deltaY: event.deltaY,
  };
  return data;
}

export const getKeyDownData = (event: KeyboardEvent) => {
  const data: IKeyDownData = {
    key: event.key,
    shift: event.shiftKey,
    meta: event.metaKey,
    ctrl: event.ctrlKey,
    alt: event.altKey,
  };
  return data;
};
