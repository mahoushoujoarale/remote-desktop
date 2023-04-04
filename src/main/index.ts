import { app, shell, BrowserWindow, ipcMain } from 'electron';
import { join } from 'path';
import { electronApp, optimizer, is } from '@electron-toolkit/utils';
import icon from '../../resources/icon.png?asset';
import { doKey, doMouse, doScroll, getDesktopCaptureSource } from './util';
import { IKeyData, IMouseData, IScrollData } from './type';
ipcMain.handle('getDesktopCaptureSource', getDesktopCaptureSource);

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1080,
    height: 720,
    show: false,
    autoHideMenuBar: true,
    // fullscreen: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      nodeIntegration: true, // To access node modules like fs & path
      contextIsolation: false,
    },
  });

  mainWindow.on('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.webContents.setWindowOpenHandler(details => {
    shell.openExternal(details.url);
    return { action: 'deny' };
  });

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL']);
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'));
  }

  return mainWindow;
}

app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron');

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  let window = createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) window = createWindow();
  });

  ipcMain.on('mouse-click', (_event, data: IMouseData) => {
    doMouse(data);
  });

  ipcMain.on('scroll', (_event, data: IScrollData) => {
    doScroll(data);
  });

  ipcMain.on('key-down', (_event, data: IKeyData) => {
    doKey(data);
  });

  // const handleWindowClose = event => {
  //   event.preventDefault();
  //   window.webContents.send('window-closing');
  // };

  // window.on('close', handleWindowClose);

  // ipcMain.on('close-window', () => {
  //   window.removeListener('close', handleWindowClose);
  //   window.close();
  // });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
