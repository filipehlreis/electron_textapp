const electron = require('electron');
const path = require('node:path');
const fs = require('fs');

const { app, BrowserWindow, dialog, ipcMain } = electron;
let win;
let filePathToSave = undefined;

const createWindow = () => {
  win = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });
  win.loadFile('index.html');
};

app.whenReady().then(() => {
  createWindow();
});

ipcMain.on('saveText', async (event, text) => {
  // save the text to a file
  console.log(text);

  if (filePathToSave === undefined) {
    const { filePath } = await dialog.showSaveDialog(win, {
      defaultPath: 'filename.txt',
    });
    filePathToSave = filePath;
  }

  if (filePathToSave === undefined) return;

  if (filePathToSave) {
    await fs.writeFile(filePathToSave, text, (err) => {
      if (err) console.log('there was an error: ', err);
      console.log('\nfile has been saved');
    });
  }
});
