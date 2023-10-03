/* eslint-disable global-require */
const { app, BrowserWindow } = require('electron');
const path = require('path');
const { initialize, enable } = require('@electron/remote/main');
const { updateCS2ServerList, displaySvPop, allPopIpv4 } = require('./src/server');

initialize();

const createWindow = async () => {
  const win = new BrowserWindow({
    width:
     800,
    height: 600,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, './src/preload.js'),
    },
  });

  enable(win.webContents);

  win.loadFile('index.html');
  win.setMenuBarVisibility(false);

  win.once('ready-to-show', () => {
    win.show();
    win.webContents.send('spinner', true);
    updateCS2ServerList().then(() => {
      win.webContents.send('spinner', false);
      win.webContents.send('paintServer', [displaySvPop, allPopIpv4]);
    });
  });
};

app.whenReady().then(() => {
  if (process.platform !== 'win32') {
    app.quit();
  }

  if (require('electron-squirrel-startup')) return;

  createWindow();
});
