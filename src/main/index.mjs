import { app, shell, BrowserWindow, dialog, ipcMain } from 'electron'
import path, { join } from 'path'
import url from 'node:url'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import setupMenu from './menu.mjs'
import { getTemplates, getPlugins } from './client.mjs'
import { prepareFolder, createApp } from './generate.mjs'
import log from 'electron-log'
import { download } from 'electron-dl'
import { getAppPath } from './lib/utils.mjs'
import Applications from './lib/applications.mjs'
import Logs from './lib/logs.mjs'
import Metrics from './lib/metrics.mjs'
import Proxy from './lib/runtime-proxy.mjs'
import { sendTemplateId } from './template-id.mjs'

log.initialize()

log.transports.file.level = 'info'
const version = app.getVersion()
const generate = require('boring-name-generator')

log.info('App starting...')
const devMode = !!(app.commandLine.getSwitchValue('dev'))
if (devMode) {
  log.info('Running in dev mode')
}

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
    if (templateId !== undefined) {
      log.info('send templateId:', templateId)

      sendTemplateId(templateId)
    }

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
    maxWidth: 1440,
    minWidth: 1280,
    minHeight: 750,
    fullscreenable: false,
    show: false,
    title: `Platformatic Meraki v${version}`,
    autoHideMenuBar: false,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      additionalArguments: [`--devMode=${devMode}`]
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
      if (templateId !== undefined) {
        log.info('send templateId:', templateId)
        sendTemplateId(templateId)
      }
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
  const appApis = await Applications.create(merakiFolder, merakiConfigFolder)
  const logsApi = new Logs(appApis)
  const metricsApi = new Metrics(appApis)
  const proxyApi = new Proxy(appApis)

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
    await createApp(path, project, uiLogger)
    await appApis.createApplication(project.projectName, join(path, project.projectName))
  })

  ipcMain.handle('update-app', async (_, id, path, project) => {
    await createApp(path, project, uiLogger, true)
    await appApis.updateApplication(id, project.projectName)
  })

  ipcMain.handle('generate-name', async () => {
    const val = await generate({ words: 1 }).dashed
    return val
  })

  ipcMain.handle('quit-app', () => {
    app.quit()
  })

  // ********** APPLICATIONS LIST ********** //
  ipcMain.handle('get-applications', async (_) => {
    return appApis.getApplications()
  })

  ipcMain.handle('get-application', async (_, id) => {
    return appApis.getApplication(id)
  })

  ipcMain.handle('import-app', async (_, path, folderName) => {
    return appApis.importApplication(path, folderName)
  })

  ipcMain.handle('delete-app', async (_, id) => {
    return appApis.deleteApplication(id, { removeFolder: true })
  })

  ipcMain.handle('start-app', async (_, appId) => {
    const { id, url } = await appApis.startRuntime(appId)
    return { id, url }
  })

  ipcMain.handle('stop-app', async (_, id) => {
    return appApis.stopRuntime(id)
  })

  ipcMain.handle('open-app', async (_, id) => {
    return appApis.openApplication(id)
  })

  // ********** LOGS ********** //
  // id: application id
  ipcMain.handle('start-logs', async (_, id, callback) => {
    logsApi.start(id, logs => {
      mainWindow.webContents.send('app-logs', logs)
    })
  })

  ipcMain.handle('pause-logs', async (_) => {
    logsApi.pause()
  })

  ipcMain.handle('resume-logs', async (_) => {
    logsApi.resume()
  })

  ipcMain.handle('stop-logs', async (_) => {
    logsApi.stop()
  })

  ipcMain.handle('get-all-logs', async (_, id) => {
    if (!id) {
      throw new Error('Application ID is required')
    }
    const logsApiURL = await logsApi.getAllLogsURL(id)
    const app = appApis.getApplication(id)
    if (!app) {
      // This should never happen
      throw new Error(`Application with id ${id} not found`)
    }
    const name = app?.name || id
    const filename = `${name}.logs`
    await download(mainWindow, logsApiURL, {
      filename,
      saveAs: true,
      showProgressBar: true,
      openFolderWhenDone: true
    })
  })

  ipcMain.handle('get-previous-logs', async (_, id) => {
    return logsApi.getPreviousLogs(id)
  })

  ipcMain.handle('there-are-prev-logs', async (_) => {
    return logsApi.thereArePreviousLogs()
  })

  // ********** METRICS ********** //
  // id: application id
  ipcMain.handle('start-metrics', async (_, id, callback) => {
    metricsApi.start(id, metrics => {
      mainWindow.webContents.send('app-metrics', metrics)
    })
  })

  ipcMain.handle('stop-metrics', async (_) => {
    metricsApi.stop()
  })

  // ********** PROXY ********** //
  // id: application id
  ipcMain.handle('start-proxy', async (_, id, serviceId) => {
    return proxyApi.start(id, serviceId)
  })

  ipcMain.handle('stop-proxy', async (_) => {
    return proxyApi.stop()
  })
})

app.on('open-url', (event, url) => {
  log.info('Received open url event for url:' + url)
  templateId = getTemplateId(url)
  log.info('Loaded templateId:', templateId)
  if (templateId !== undefined) {
    log.info('send templateId:', templateId)
    sendTemplateId(templateId)
  }

  if (mainWindow) {
    // log.info('Loading on mainWindow:' + getCurrentURL())
    // mainWindow.loadURL(getCurrentURL())
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
