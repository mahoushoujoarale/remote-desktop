import { desktopCapturer, screen } from "electron";
import { IKeyboardData, IMouseData } from "./type";
import robot from 'robotjs';

export const handleMouse = (data: IMouseData) => {
  const { offset, video } = data;
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width: screenWidth, height: screenHeight } = primaryDisplay.size;
  const x: number = offset.x * screenWidth / video.width;
  const y: number = offset.y * screenHeight / video.height;
  robot.moveMouse(x, y);
  robot.mouseClick();
};

export const handleKey = (data: IKeyboardData) => {
  const modifiers: string[] = [];
  // 这里robotjs比较蠢，修饰符必须按照顺序添加
  if (data.shift) modifiers.push('shift');
  if (data.ctrl) modifiers.push('ctrl');
  if (data.alt) modifiers.push('alt');
  if (data.meta) modifiers.push('meta');
  robot.keyTap(data.key, modifiers);
};

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
