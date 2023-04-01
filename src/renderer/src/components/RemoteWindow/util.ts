import { IMouseData, IKeyboardData } from "./type";

export const handleMouse = (event: MouseEvent) => {
  const video = event.target as HTMLVideoElement;
  const data: IMouseData = {
    offset: {
      x: event.offsetX,
      y: event.offsetY,
    },
    video: {
      width: video.offsetWidth,
      height: video.offsetHeight,
    },
  };
  window.api.handleMouse(data);
};

export const handleKey = (event: KeyboardEvent) => {
  const data: IKeyboardData = {
    key: event.key,
    shift: event.shiftKey,
    meta: event.metaKey,
    ctrl: event.ctrlKey,
    alt: event.altKey,
  };
  window.api.handleKeyboard(data);
};
