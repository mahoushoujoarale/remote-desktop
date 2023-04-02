import { desktopCapturer, screen } from "electron";
import { IKeyDownData, IMouseClickData, IScrollData } from "./type";
import robot from 'robotjs';

export const getDesktopCaptureSource = async () => {
  const sources = await desktopCapturer.getSources({
    types: ['screen'],
    thumbnailSize: {
      height: 300,
      width: 300,
    },
    fetchWindowIcons: true,
  });

  return sources;
};

export const doMouseClick = (data: IMouseClickData) => {
  const { offset, video } = data;
  const { width: screenWidth, height: screenHeight } = screen.getPrimaryDisplay().size;
  const x: number = offset.x * screenWidth / video.width;
  const y: number = offset.y * screenHeight / video.height;
  robot.moveMouse(x, y);
  robot.mouseClick();
};

export const doScroll = (data: IScrollData) => {
  robot.scrollMouse(data.deltaX, data.deltaY);
};

export const doKeyDown = (data: IKeyDownData) => {
  const modifiers: string[] = [];
  // 这里robotjs比较蠢，修饰符必须按照顺序添加
  if (data.shift) modifiers.push('shift');
  if (data.ctrl) modifiers.push('ctrl');
  if (data.alt) modifiers.push('alt');
  if (data.meta) modifiers.push('meta');
  robot.keyTap(data.key, modifiers);
};