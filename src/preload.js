const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  saveText: (text) => ipcRenderer.send('saveText', text),
  savedFileStatus: (callback) => ipcRenderer.on('saved', callback),
  saveClicked: (text) => ipcRenderer.on('save-clicked', text),
  saveAsClicked: (text) => ipcRenderer.on('saveas-clicked', text),
});
