import { app, shell, BrowserWindow, dialog, ipcMain } from 'electron'
import path, { join } from 'path'
import url from 'node:url'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import setupMenu from './menu.mjs'
import { getTemplates, getPlugins } from './client.mjs'
import { prepareFolder, createApp } from './generate.mjs'
import log from 'electron-log'
import runtimes from './runtimes.mjs'

log.transports.file.level = 'debug'
log.transports.console.level = 'debug'

const version = app.getVersion()
const generate = require('boring-name-generator')

log.info('App starting...')

// Create a URL to load in the main window based on params passed in meraki:// protocol
const getTemplateId = url => {
  if (!url || url === '') return ''
  const urlSplit = url.split('//')
  let templateId = urlSplit[1]
  if (templateId && templateId.endsWith('/')) {
    templateId = templateId.slice(0, -1)
  }
  return templateId
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
let templateId = null

const getCurrentURL = () => {
  // Load the remote URL for development or the local html file for production.
  // if the application was closed, we assume that templateId is already be initialized
  const query = templateId ? { templateId } : null
  let currentURL = null
  if (is.dev && process.env.ELECTRON_RENDERER_URL) {
    const parsedUrl = new URL(process.env.ELECTRON_RENDERER_URL)
    currentURL = url.format({
      pathname: parsedUrl.pathname,
      host: parsedUrl.host,
      protocol: parsedUrl.protocol,
      query,
      slashes: true
    })
  } else {
    currentURL = url.format({
      pathname: join(__dirname, '../renderer/index.html'),
      protocol: 'file:',
      query,
      slashes: true
    })
  }
  return currentURL
}

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
  // in win and linux, if the app is already open, emits `second-instance`
  // See: https://www.electronjs.org/docs/latest/tutorial/launch-app-from-url-in-another-app
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    const passedUrl = commandLine.pop()
    log.info(`Received second-instance. Opening meraki for: ${passedUrl}`)
    templateId = getTemplateId(passedUrl)
    log.info('Received templateId:' + templateId)
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus()
      log.info('Loading URL: ' + getCurrentURL())
      mainWindow.loadURL(getCurrentURL())
    }
  })
}

function createWindow () {
  mainWindow = new BrowserWindow({
    minWidth: 1024,
    minHeight: 750,
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

  if (process.argv.length > 1) {
    const passedUrl = process.argv.length > 1 ? process.argv[1] : null
    if (passedUrl) {
      log.info(`Received args. Opening meraki for: ${passedUrl}`)
      templateId = getTemplateId(passedUrl)
      log.info('Received templateId:' + templateId)
    }
  }

  const currentUrl = getCurrentURL()
  log.info('Loading URL: ' + currentUrl)
  mainWindow.loadURL(currentUrl)

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

app.on('open-url', (event, url) => {
  log.info('Received open url event for url:' + url)
  templateId = getTemplateId(url)
  log.info('Loaded templateId:', templateId)

  if (mainWindow) {
    log.info('Loading on mainWindow:' + getCurrentURL())
    mainWindow.loadURL(getCurrentURL())
  } else if (app.isReady()) {
    log.info('Creating a new mainWindow:' + getCurrentURL())
    // In OSx the app can be running with no windows (because closed)
    createWindow()
    log.info('Loading on mainWindow:' + getCurrentURL())
    mainWindow.loadURL(getCurrentURL())
  }
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
  mainWindow = null
})

// Start polling of runtimes
runtimes.poll()
