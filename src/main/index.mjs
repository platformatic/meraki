import { app, shell, BrowserWindow, dialog, ipcMain } from 'electron'
import path, { join } from 'path'
import url from 'node:url'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import setupMenu from './menu.mjs'
import { getTemplates, getPlugins } from './client.mjs'
import { prepareFolder, createApp } from './generate.mjs'
import log from 'electron-log'
import { getAppPath } from './lib/utils.mjs'
import Applications from './lib/applications.mjs'

log.initialize()

log.transports.file.level = 'info'
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
    log.info('Received templateId:', templateId)
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

app.whenReady().then(async () => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // The first folder is where `migrations` is located, the second is where the `meraki.sqlite` is located
  const merakiFolder = getAppPath()
  const merakiConfigFolder = app.getPath('userData')
  const appApis = Applications.create(merakiFolder, merakiConfigFolder)
  const appList = await appApis.getApplications()
  log.info('Applications list loaded at startup', appList)

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

  ipcMain.handle('import-app', async (_, path, appName) => {
    // MOCK TO REMOVE
    // return importApp(path, uiLogger, appName)
    const pro = new Promise((resolve, reject) => {
      setTimeout(() => {
        // return resolve(true)
        return reject(new Error('Boom'))
      }, 2000)
    })
    return pro
  })

  ipcMain.handle('get-applications', async (_) => {
    // MOCK TO REMOVE
    // return importApp(path, uiLogger, appName)
    const pro = new Promise((resolve, reject) => {
      setTimeout(() => {
        return resolve([{
          id: '1',
          name: 'Ransom',
          status: 'running',
          platformaticVersion: '1.0.0',
          updateVersion: true,
          lastStarted: '1708887874046',
          lastUpdate: '1708887874046',
          insideMeraki: true
        }, {
          id: '2',
          name: 'Coolhio',
          status: 'stopped',
          platformaticVersion: '3.0.0',
          lastStarted: '1706295948105',
          lastUpdate: '1706295948105',
          insideMeraki: false
        }, {
          id: '3',
          name: 'a horse with a long long long name',
          status: 'running',
          platformaticVersion: '3.0.0',
          lastStarted: '1706295948105',
          lastUpdate: '1706295948105',
          insideMeraki: true
        }, {
          id: '4',
          name: 'pitiful',
          status: 'running',
          platformaticVersion: '1.0.0',
          updateVersion: true,
          lastStarted: '1708715157920',
          lastUpdate: '1708715157920',
          insideMeraki: false
        }, {
          id: '5',
          name: 'searching',
          status: 'running',
          platformaticVersion: '1.0.0',
          updateVersion: true,
          lastStarted: '1708023980957',
          lastUpdate: '1708023980957',
          insideMeraki: true
        }, {
          id: '6',
          name: 'trouble',
          status: 'stopped',
          platformaticVersion: '1.0.0',
          updateVersion: true,
          lastStarted: '1708283136299',
          lastUpdate: '1708283136299',
          insideMeraki: false
        }, {
          id: '7',
          name: 'loading',
          status: 'stopped',
          platformaticVersion: '1.0.0',
          updateVersion: true,
          lastStarted: '1708628722661',
          lastUpdate: '1708628722661',
          insideMeraki: true
        }, {
          id: '8',
          name: 'Dodge',
          status: 'running',
          platformaticVersion: '3.0.0',
          lastStarted: '1708801496452',
          lastUpdate: '1708801496452',
          insideMeraki: false
        }, {
          id: '9',
          name: 'Dodge - 2',
          status: 'running',
          platformaticVersion: '3.0.0',
          lastStarted: '1677425773811',
          lastUpdate: '1677425773811',
          insideMeraki: false
        }, {
          id: '10',
          name: 'Dodge - 3',
          status: 'running',
          platformaticVersion: '3.0.0',
          lastStarted: '1677425773811',
          lastUpdate: '1677425773811',
          insideMeraki: false
        }, {
          id: '11',
          name: 'Dodge - 4',
          status: 'running',
          platformaticVersion: '3.0.0',
          lastStarted: '1677425773811',
          lastUpdate: '1677425773811',
          insideMeraki: false
        }, {
          id: '12',
          name: 'Dodge - 5',
          status: 'stopped',
          platformaticVersion: '1.0.0',
          updateVersion: true,
          lastStarted: '1677425773811',
          lastUpdate: '1677425773811',
          insideMeraki: true
        }]
        )
        // return reject(new Error('Boom'))
      }, 2000)
    })
    return pro
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
