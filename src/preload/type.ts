import { IKeyDownData, IMouseClickData, IScrollData } from '../main/type';

export interface IApi {
  getMediaStream: () => Promise<MediaStream | null>;
  doMouseClick: (data: IMouseClickData) => void;
  doScroll: (data: IScrollData) => void;
  doKeyDown: (data: IKeyDownData) => void;
}
