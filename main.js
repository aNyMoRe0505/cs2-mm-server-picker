/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable global-require */
const {
  app, BrowserWindow, ipcMain, dialog,
} = require('electron');
const path = require('path');
const ping = require('ping');
const { updateCS2ServerList, displaySvPop, allPopIpv4 } = require('./src/server');
const { apply, reset } = require('./src/firewall');

const createWindow = async () => {
  const win = new BrowserWindow({
    width:
     800,
    height: 600,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, './src/preload.js'),
    },
  });

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
  if (require('electron-squirrel-startup')) return;

  if (process.platform !== 'win32') {
    app.quit();
  }

  ipcMain.handle('updatePing', async (_, ipAddress) => {
    let popPingSum = 0;
    for (const ipv4 of ipAddress) {
      const { max } = await ping.promise.probe(ipv4);
      popPingSum += Number(max);
    }
    return Math.round(popPingSum / ipAddress.length);
  });

  ipcMain.on('applyFirewallRule', (_, targetBlockIp) => {
    apply(targetBlockIp);
    dialog.showMessageBoxSync({
      type: 'info',
      message: '可能會要求權限, 接受後想確認是否成功可以到防火牆 -> 進階設定 -> 輸出規則 查看是否有 cs2-mm-server-picker',
    });
  });

  ipcMain.on('resetFirewallRule', () => {
    reset();
    dialog.showMessageBoxSync({
      type: 'info',
      message: '可能會要求權限, 接受後想確認是否重置成功可以到防火牆 -> 進階設定 -> 輸出規則 查看 cs2-mm-server-picker 是否已經刪除',
    });
  });

  createWindow();
});
