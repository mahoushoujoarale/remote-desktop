import { contextBridge, ipcRenderer } from 'electron';
import { electronAPI } from '@electron-toolkit/preload';
import { getStreamBySources } from './util';
import { IApi } from './type';
import { IKeyboardData, IMouseData } from '../main/type';

// Custom APIs for renderer
const api: IApi = {
  handleMouse: (data: IMouseData) => {
    ipcRenderer.send('mouse-event', data);
  },
  handleKeyboard: (data: IKeyboardData) => {
    ipcRenderer.send('keyboard-event', data);
  },
  getMediaStream: async () => {
    const sources = await ipcRenderer.invoke('getDesktopCaptureSource');
    return getStreamBySources(sources);
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
