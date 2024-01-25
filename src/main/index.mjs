import { app, shell, BrowserWindow, dialog, ipcMain } from 'electron'
import path, { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import setupMenu from './menu.mjs'
import { getTemplates, getPlugins } from './client.mjs'
import { prepareFolder, createApp } from './generate.mjs'
import log from 'electron-log'

log.transports.file.level = 'info'
const version = app.getVersion()
const generate = require('boring-name-generator')

log.info('App starting...')

const isMac = process.platform === 'darwin'

// HMR for renderer base on electron-vite cli.
// Load the remote URL for development or the local html file for production.
let currentUrl
let loadFile = false
if (is.dev && process.env.ELECTRON_RENDERER_URL) {
  currentUrl = process.env.ELECTRON_RENDERER_URL
} else {
  currentUrl = join(__dirname, '../renderer/index.html')
  loadFile = true
}

// Create a URL to load in the main window based on params passed in meraki:// protocol
const getURLToLoad = url => {
  const urlSplit = url.split('//')
  const templateId = urlSplit[1]
  return currentUrl + '?templateId=' + templateId
}

const elaborateLine = (...args) => {
  let line = ''
  let obj = {}
  switch (args.length) {
    case 1:
      line = args[0]
      break
    default:
      obj = args[0]
      line = args[1]
      break
  }
  Object.keys(obj).forEach(k => {
    line = line.replace('${' + k + '}', obj[k])
  })
  return line
}

const uiLogger = {}
let mainWindow

// Protocol handler. See: https://www.electronjs.org/docs/latest/tutorial/launch-app-from-url-in-another-app
if (process.defaultApp) {
  if (process.argv.length >= 2) {
    app.setAsDefaultProtocolClient('meraki', process.execPath, [path.resolve(process.argv[1])])
  }
} else {
  if (!app.isDefaultProtocolClient('meraki')) {
    // Deep linking works on packaged versions of the application!
    app.setAsDefaultProtocolClient('meraki')
  }
}

const gotTheLock = app.requestSingleInstanceLock()
if (!gotTheLock) {
  app.quit()
} else {
  if (!isMac) {
    log.info('Running in windows or linux')
    // See: https://www.electronjs.org/docs/latest/tutorial/launch-app-from-url-in-another-app
    app.on('second-instance', (event, commandLine, workingDirectory) => {
      if (mainWindow) {
        if (mainWindow.isMinimized()) mainWindow.restore()
        mainWindow.focus()
      }
      log.info(`Meraki opened for: ${commandLine.pop()}`)
      const url = getURLToLoad(commandLine.pop())
      log.info('Loading URL: ' + url)
      if (mainWindow) {
        mainWindow.loadURL(url)
      }
    })
  }
}

function createWindow () {
  mainWindow = new BrowserWindow({
    minWidth: 1024,
    minHeight: 786,
    show: false,
    title: `Platformatic Meraki v${version}`,
    autoHideMenuBar: false,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.maximize()
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  console.log('Loading URL: ' + currentUrl)

  if (!loadFile) {
    mainWindow.loadURL(currentUrl)
  } else {
    mainWindow.loadFile(currentUrl)
  }

  uiLogger.error = function (args) {
    mainWindow.webContents.send('log', { level: 'error', message: elaborateLine(args) })
  }
  uiLogger.info = function (...args) {
    mainWindow.webContents.send('log', { level: 'info', message: elaborateLine(...args) })
  }

  setupMenu()

  // Protocol handler. See: https://www.electronjs.org/docs/latest/tutorial/launch-app-from-url-in-another-app
  if (!app.isDefaultProtocolClient('meraki')) {
    // Deep linking works on packaged versions of the application!
    app.setAsDefaultProtocolClient('meraki')
  }
}

app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })

  ipcMain.handle('select-folder', async (event) => {
    const result = await dialog.showOpenDialog({ properties: ['openDirectory'] })
    if (result.canceled) {
      return null
    } else {
      return result.filePaths[0]
    }
  })

  ipcMain.handle('get-templates', async () => {
    return getTemplates()
  })

  ipcMain.handle('get-plugins', async () => {
    return getPlugins()
  })

  ipcMain.handle('prepare-folder', async (_, path, templates, appName) => {
    return prepareFolder(path, templates, uiLogger, appName)
  })

  ipcMain.handle('create-app', async (_, path, project) => {
    return createApp(path, project, uiLogger)
  })

  ipcMain.handle('quit-app', () => {
    app.quit()
  })

  ipcMain.handle('generate-name', async () => {
    const val = await generate({ words: 1 }).dashed
    return val
  })
})

if (isMac) {
  // deep link on mac
  app.on('open-url', (event, url) => {
    log.info('Meraki opened for url:' + url)
    if (mainWindow) {
      mainWindow.loadURL(getURLToLoad(url))
    }
  })
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
