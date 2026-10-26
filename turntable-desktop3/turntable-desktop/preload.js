const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('desktop', {
  onOpen: cb => ipcRenderer.on('open-files', (_e, list) => cb(list)),
  ready: () => ipcRenderer.send('renderer-ready'),
  mini: on => ipcRenderer.send('mini', !!on)
});
