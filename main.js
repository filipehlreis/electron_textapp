const electron = require('electron');
const { app, BrowserWindow, ipcMain } = electron;
const path = require('node:path');

// app.on('ready', () => {
//   let win = new BrowserWindow({
//     webPreferences: {
//       nodeIntegration: true,
//     },
//   });
//   win.loadFile('index.html');
// });

const createWindow = () => {
  let win = new BrowserWindow({
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });
  win.loadFile('index.html');
};

app.whenReady().then(() => {
  createWindow();
});

ipcMain.on('saveText', (event, text) => {
  // save the text to a file
  console.log(text);
});
