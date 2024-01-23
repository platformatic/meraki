import { app, Menu } from 'electron'

export class ProtocolUtils {
  static setDefaultProtocolClient () {
    if (!app.isDefaultProtocolClient('meraki')) {
      // Define custom protocol handler.
      // Deep linking works on packaged versions of the application!
      app.setAsDefaultProtocolClient('meraki')
    }
  }

  static setProtocolHandlerWindowsLinux () {
    // Force Single Instance Application
    const gotTheLock = app.requestSingleInstanceLock()

    app.on('second-instance', (e, argv) => {
      // Someone tried to run a second instance, we should focus our window.
      if (MainWindow.mainWindow) {
        if (MainWindow.mainWindow.isMinimized()) MainWindow.mainWindow.restore()
        MainWindow.mainWindow.focus()
      } else {
        // Open main windows
        MainWindow.openMainWindow()
      }

      app.whenReady().then(() => {
        MainWindow.mainWindow.loadURL(this._getDeepLinkUrl(argv))
      })
    })

    if (gotTheLock) {
      app.whenReady().then(() => {
        // Open main windows
        MainWindow.openMainWindow()
        MainWindow.mainWindow.loadURL(this._getDeepLinkUrl())
      })
    } else {
      app.quit()
    }
  }

  static setProtocolHandlerOSX () {
    app.on('open-url', (event, url) => {
      event.preventDefault()
      app.whenReady().then(() => {
        if (!isNil(url)) {
          // Open main windows
          MainWindow.openMainWindow()
          MainWindow.mainWindow.loadURL(this._getUrlToLoad(url))
        } else {
          this._logInMainWindow({ s: 'URL is undefined', isError: true })
          throw new Error('URL is undefined')
        }
      })
    })
  }

  static _getUrlToLoad (url) {
    // Ex: url = meraki://deep-link/test?params1=paramValue
    // Ex: Split for remove meraki:// and get deep-link/test?params1=paramValue
    const splittedUrl = url.split('//')
    // Generate URL to load in WebApp.
    // Ex: file://path/index.html#deep-link/test?params1=paramValue
    const urlToLoad = format({
      pathname: Env.BUILDED_APP_INDEX_PATH,
      protocol: 'file:',
      slashes: true,
      hash: `#${splittedUrl[1]}`
    })

    return urlToLoad
  }

  static _getDeepLinkUrl (argv) {
    let url
    const newArgv = !isNil(argv) ? argv : process.argv
    // Protocol handler
    if (process.platform === 'win32' || process.platform === 'linux') {
      // Get url form precess.argv
      newArgv.forEach((arg) => {
        if (/meraki:\/\//.test(arg)) {
          url = arg
        }
      })

      if (!isNil(url)) {
        return this._getUrlToLoad(url)
      } else if (!isNil(argv) && isNil(url)) {
        this._logInMainWindow({ s: 'URL is undefined', isError: true })
        throw new Error('URL is undefined')
      }
    }
  }
}

export default ProtocolUtils
