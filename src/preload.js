const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  saveText: (text) => ipcRenderer.send('saveText', text),
  savedFileStatus: (callback) => ipcRenderer.on('saved', callback),
});
