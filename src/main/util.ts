import { desktopCapturer } from 'electron';
import { IKeyData, IMouseData, IScrollData } from './type';
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

export const doMouse = (data: IMouseData) => {
  const { offset, video, type, button } = data;
  // 这里用robotjs拿到屏幕尺寸才对，其他方法会有各种兼容性问题
  const x: number = (offset.x / video.width) * robot.getScreenSize().width;
  const y: number = (offset.y / video.height) * robot.getScreenSize().height;
  if (type === 'move') {
    robot.moveMouseSmooth(x, y);
  } else {
    robot.moveMouse(x, y);
    robot.mouseToggle(type, button);
  }
};

export const doScroll = (data: IScrollData) => {
  robot.scrollMouse(data.deltaX, data.deltaY);
};

export const doKey = (data: IKeyData) => {
  const modifiers: string[] = [];
  // 这里robotjs比较蠢，修饰符必须按照顺序添加
  if (data.shift) modifiers.push('shift');
  if (data.ctrl) modifiers.push('ctrl');
  if (data.alt) modifiers.push('alt');
  if (data.meta) modifiers.push('meta');
  const key = data.key;
  try {
    robot.keyToggle(key, data.type, modifiers);
  } catch (error) {
    console.log(key, error);
  }
};
