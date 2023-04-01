import { DesktopCapturerSource, contextBridge, ipcRenderer } from 'electron';
import { electronAPI } from '@electron-toolkit/preload';
import { getStreamById } from './util';
import { IApi } from './type';
import { IKeyboardData, IMouseData } from '../main/type';

const setRemoteVideo = async (event, sourceId: DesktopCapturerSource) => {
  const stream = await getStreamById(sourceId);
  const video: HTMLVideoElement | null = document.querySelector('#remote-video');
  if (video) {
    video.srcObject = stream;
    video.onloadedmetadata = (e) => video.play();
  }
};

// Custom APIs for renderer
const api: IApi = {
  handleConnect: () => {
    ipcRenderer.send('session-connect');
    ipcRenderer.on('set-remote-video', setRemoteVideo);
  },
  handleDisconnect: () => {
    ipcRenderer.removeListener('set-remote-video', setRemoteVideo);
  },
  handleMouse: (data: IMouseData) => {
    ipcRenderer.send('mouse-event', data);
  },
  handleKeyboard: (data: IKeyboardData) => {
    ipcRenderer.send('keyboard-event', data);
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
