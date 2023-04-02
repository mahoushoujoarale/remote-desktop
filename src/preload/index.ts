import { contextBridge, ipcRenderer } from 'electron';
import { electronAPI } from '@electron-toolkit/preload';
import { getStreamBySources } from './util';
import { IApi } from './type';
import { IKeyDownData, IMouseClickData, IScrollData } from '../main/type';

// Custom APIs for renderer
const api: IApi = {
  getMediaStream: async () => {
    const sources = await ipcRenderer.invoke('getDesktopCaptureSource');
    return getStreamBySources(sources);
  },
  doMouseClick: (data: IMouseClickData) => {
    data.screen = {
      width: window.screen.width,
      height: window.screen.height,
    };
    ipcRenderer.send('mouse-click', data);
  },
  doScroll: (data: IScrollData) => {
    ipcRenderer.send('scroll', data);
  },
  doKeyDown: (data: IKeyDownData) => {
    ipcRenderer.send('key-down', data);
  },
};

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI);
    contextBridge.exposeInMainWorld('api', api);
  } catch (error) {
    console.error(error);
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI;
  // @ts-ignore (define in dts)
  window.api = api;
}
