const { app, BrowserWindow, ipcMain, shell, Menu } = require('electron');
const path = require('path');
const fs = require('fs');
let autoUpdater = null;
try { autoUpdater = require('electron-updater').autoUpdater; } catch (e) {}

const MIME = {
  '.mp3': 'audio/mpeg', '.m4a': 'audio/mp4', '.wav': 'audio/wav', '.ogg': 'audio/ogg',
  '.opus': 'audio/ogg', '.flac': 'audio/flac', '.aac': 'audio/aac',
  '.lrc': 'text/plain', '.txt': 'text/plain'
};
let win = null, ready = false, pending = [];

function mediaPaths(argv) {
  return argv.filter(a => !a.startsWith('-') && MIME[path.extname(a).toLowerCase()] && fs.existsSync(a));
}
async function readItems(paths) {
  return Promise.all(paths.map(async p => ({
    name: path.basename(p),
    type: MIME[path.extname(p).toLowerCase()],
    data: await fs.promises.readFile(p)
  })));
}
async function openPaths(paths) {
  if (!paths.length) return;
  const items = await readItems(paths);
  if (win && ready) win.webContents.send('open-files', items);
  else pending.push(...items);
}

function createWindow() {
  win = new BrowserWindow({
    width: 1040, height: 760, minWidth: 380, minHeight: 560,
    backgroundColor: '#0e0c1c', title: 'Turntable', autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true, nodeIntegration: false,
      autoplayPolicy: 'no-user-gesture-required'
    }
  });
  win.loadFile(path.join(__dirname, 'index.html'));
  win.webContents.on('did-start-loading', () => { ready = false; });
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (/^https?:/.test(url)) shell.openExternal(url);
    return { action: 'deny' };
  });
  win.webContents.on('will-navigate', (e, url) => {
    if (!url.startsWith('file:')) { e.preventDefault(); if (/^https?:/.test(url)) shell.openExternal(url); }
  });
  win.on('closed', () => { win = null; ready = false; });
}

ipcMain.on('renderer-ready', () => {
  ready = true;
  if (win && pending.length) { win.webContents.send('open-files', pending); pending = []; }
});

let normalBounds = null;
ipcMain.on('mini', (e, on) => {
  if (!win) return;
  if (on) {
    normalBounds = win.getBounds();
    win.setMinimumSize(320, 420); win.setSize(360, 500); win.setAlwaysOnTop(true);
  } else {
    win.setAlwaysOnTop(false); win.setMinimumSize(380, 560);
    if (normalBounds) win.setBounds(normalBounds);
  }
});

if (!app.requestSingleInstanceLock()) {
  app.quit();
} else {
  app.on('second-instance', (e, argv) => {
    if (win) { if (win.isMinimized()) win.restore(); win.focus(); }
    openPaths(mediaPaths(argv.slice(1)));
  });
  app.on('open-file', (e, p) => { e.preventDefault(); openPaths([p]); });
  app.whenReady().then(() => {
    if (process.platform !== 'darwin') Menu.setApplicationMenu(null);
    createWindow();
    openPaths(mediaPaths(process.argv.slice(1)));
    if (autoUpdater && app.isPackaged) { autoUpdater.checkForUpdatesAndNotify().catch(() => {}); }
    app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
  });
  app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
}
