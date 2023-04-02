import { IKeyDownData, IMouseClickData } from "./components/RemoteWindow/type";
import robot from 'robotjs';

export const doMouseClick = (data: IMouseClickData) => {
  const { offset, video } = data;
  const screen = window.screen;
  const x: number = offset.x * screen.width / video.width;
  const y: number = offset.y * screen.height / video.height;
  robot.moveMouse(x, y);
  robot.mouseClick();
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
