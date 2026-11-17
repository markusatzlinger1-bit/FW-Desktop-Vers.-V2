'use strict';

// Forward — Electron entry point. No cloud connections, accounts or telemetry.
// `forward://app/` is a stable, secure, local origin, so IndexedDB data survive restarts.
const { app, BrowserWindow, protocol, net, shell } = require('electron');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

const FILES = new Set([
  'index.html','style.css','app.js','sw.js','manifest.json',
  'icon-192.png','icon-512.png','plop.wav','thud.wav'
]);

protocol.registerSchemesAsPrivileged([{
  scheme: 'forward',
  privileges: {
    standard: true,
    secure: true,
    supportFetchAPI: true,
    stream: true,
    allowServiceWorkers: true
  }
}]);

let mainWindow;

function installLocalProtocol() {
  protocol.handle('forward', request => {
    try {
      const url = new URL(request.url);
      if (url.hostname !== 'app') return new Response('Not found', { status: 404 });
      const resource = decodeURIComponent(url.pathname).replace(/^\/+/, '') || 'index.html';
      if (!FILES.has(resource)) return new Response('Not found', { status: 404 });
      return net.fetch(pathToFileURL(path.join(__dirname, 'web', resource)).toString());
    } catch (error) {
      return new Response('Bad request', { status: 400 });
    }
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1540,
    height: 940,
    minWidth: 980,
    minHeight: 680,
    backgroundColor: '#070b13',
    title: 'Forward — Writing Studio',
    icon: path.join(__dirname, 'web', 'icon-512.png'),
    autoHideMenuBar: true,
    webPreferences: {
      sandbox: true,
      nodeIntegration: false,
      contextIsolation: true,
      spellcheck: true,
      backgroundThrottling: false
    }
  });

  // Keep the renderer on the application's private, local protocol.
  mainWindow.webContents.on('will-navigate', (event, url) => {
    if (!url.startsWith('forward://app/')) event.preventDefault();
  });
  mainWindow.webContents.setWindowOpenHandler(() => ({action: 'deny'}));
  mainWindow.loadURL('forward://app/index.html');
  mainWindow.on('closed', () => { mainWindow = null; });
}

app.whenReady().then(() => {
  installLocalProtocol();
  createWindow();
  app.on('activate', () => {if (BrowserWindow.getAllWindows().length === 0) createWindow();});
});
app.on('window-all-closed', () => {if (process.platform !== 'darwin') app.quit();});
