const electron = require('electron');
const path = require('node:path');
const fs = require('fs');

const { app, BrowserWindow, dialog, ipcMain, Menu } = electron;
let win;
let filePathToSave = undefined;
let saveAs = false;

const createWindow = () => {
  win = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });
  win.loadFile('src/index.html');

  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);
};

app.whenReady().then(() => {
  createWindow();
});

ipcMain.on(
  'saveText' || 'save-clicked' || 'saveas-clicked',
  async (event, text) => {
    // save the text to a file
    console.log(`text -> ${text}`);
    let canceledDiag = false;

    if (saveAs || filePathToSave === undefined || filePathToSave === '') {
      let { filePath, canceled } = await dialog.showSaveDialog(win, {
        defaultPath: 'filename.txt',
      });
      win.webContents.send('saved', 'cancelled/failed');

      if (canceled) {
        filePath = filePathToSave;
        canceledDiag = canceled;
      }
      saveAs = false;
      filePathToSave = filePath === '' ? undefined : filePath;
    }

    if (filePathToSave === undefined || canceledDiag) return;

    if (filePathToSave) {
      writeFileFunction(filePathToSave, text);
    }
  },
);

const menuTemplate = [
  ...(process.platform == 'darwin'
    ? [
        {
          label: app.getName(),
          submenu: [{ role: 'about' }],
        },
      ]
    : []),
  {
    label: 'File',
    submenu: [
      {
        label: 'Save',
        click() {
          console.log('save from menu');
          win.webContents.send('save-clicked');
        },
      },
      {
        label: 'Save As ...',
        click() {
          console.log('save as ... from menu');
          // filePathToSave = undefined;
          saveAs = true;
          win.webContents.send('saveas-clicked');
        },
      },
    ],
  },
  { role: 'editMenu' },
];

const writeFileFunction = async (filePath, text) => {
  await fs.writeFile(filePath, text, (err) => {
    if (err) console.log('there was an error: ', err);
    console.log('file has been saved\n');
    win.webContents.send('saved', 'success');
  });
};
