const { app, Menu, BrowserWindow, dialog, ipcMain } = require('electron/main')
const path = require('node:path')

const isMac = process.platform === 'darwin'

const template = [...(isMac ? [{
  label: app.name,
  submenu: [{
    label: `About ${app.name}`,
    role: 'about'
  }]
}, {
  label: 'File',
  submenu: [
    { role: 'close' }
  ]
}, {
  label: "Edit",
  submenu: [
    { role: 'undo' },
    { role: 'redo' },
    { type: 'separator' },
    { role: 'cut' },
    { role: 'copy' },
    { role: 'paste' },
    { role: 'pasteAndMatchStyle' },
    { role: 'delete' },
    { role: 'selectAll' },
    { type: 'separator' },
    {
      label: 'Speech',
      submenu: [
        { role: 'startSpeaking' },
        { role: 'stopSpeaking' }
      ]
    }
  ]
}] : [
  {
    label: 'File',
    submenu: [
      { role: 'quit' }
    ]
  }
])];

const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)

function createWindow() {
  const win = new BrowserWindow({
    width: 860,
    height: 650,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, 'images/icon.png')
  })
  win.loadFile(path.join(__dirname, 'index.html'));
  // win.webContents.openDevTools();
}

app.whenReady().then(() => {
  ipcMain.handle('dialog:open', async (event, args) => {
    const result = await dialog.showOpenDialog({ properties: ['openDirectory', 'createDirectory'] });
    return result.filePaths;
  })

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})



app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
