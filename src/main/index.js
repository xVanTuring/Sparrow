'use strict'

import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'path'
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}
let mainWindow, backgroundWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`
const backgroundURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080/background.html`
  : `file://${__dirname}/background.html`

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 620,
    width: 1000,
    minWidth: 1000,
    minHeight: 610,
    frame: false,
    resizable: true,
    backgroundColor: '#353535',
    icon: path.join(__static, './icons/png/64x64.png'),
    webPreferences: {
      webSecurity: false
    }
  })
  mainWindow.setMenu(null)

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
  mainWindow.webContents.on('will-navigate', (eve) => {
    // no navigate
    eve.preventDefault()
  })
  mainWindow.webContents.on('dom-ready', () => {
    if (backgroundWindow) {
      backgroundWindow.webContents.send('reload-library')
    } else {
      createBackgroundProcess()
    }
  })
  mainWindow.webContents.on('console-message', (sourceid, level, message) => {
    console.log(message)
  })
}
function createBackgroundProcess () {
  backgroundWindow = new BrowserWindow({
    height: 100,
    width: 300,
    icon: path.join(__static, './icons/png/64x64.png')
    // focusable: false,
    // resizable: false,
    // show: false
    // parent: mainWindow
  })
  backgroundWindow.setMenu(null)
  backgroundWindow.loadURL(backgroundURL)
}
app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */

// IPC
ipcMain.on('ui-create-library', (event, args) => {
  mainWindow.webContents.send('ui-create-library', args)
})

ipcMain.on('ui-library-loaded', (events, args) => {
  mainWindow.webContents.send('ui-library-loaded', args)
  console.log('ui-library-loaded')
})
ipcMain.on('bg-create-library', (event, args) => {
  backgroundWindow.webContents.send('bg-create-library', args)
  // console.log(args)
})
ipcMain.on('bg-add-local-images', (event, args) => {
  console.log(args)
  backgroundWindow.webContents.send('bg-add-local-images', args)
})
ipcMain.on('bg-save-library-config', (event, args) => {
  backgroundWindow.webContents.send('bg-save-library-config', args)
})
ipcMain.on('bg-update-images', (event, args) => {
  backgroundWindow.webContents.send('bg-update-images', args)
})
ipcMain.on('ui-update-image', (event, meta) => {
  mainWindow.webContents.send('ui-update-image', meta)
})
ipcMain.on('ui-image-loaded', (event, args) => {
  mainWindow.webContents.send('ui-image-loaded', args)
})
