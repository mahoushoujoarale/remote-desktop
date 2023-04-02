import { socket } from "@renderer/socket";
import { IMouseClickData, IKeyDownData } from "./type";

export const handleMouseClick = (event: MouseEvent) => {
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
  socket.emit('mouseclick', data);
};

export const handleKey = (event: KeyboardEvent) => {
  const data: IKeyDownData = {
    key: event.key,
    shift: event.shiftKey,
    meta: event.metaKey,
    ctrl: event.ctrlKey,
    alt: event.altKey,
  };
  socket.emit('keydown', data);
};
