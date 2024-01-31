import { BrowserWindow } from 'electron'

import log from 'electron-log'

const USER_STATUS = {
  UNKNOWN: 'UNKNOWN',
  LOGGED_IN: 'LOGGED_IN',
  INVALID_API_KEY: 'INVALID_API_KEY',
  NO_API_KEY: 'NO_API_KEY'
}

let currentUserStatus = USER_STATUS.UNKNOWN

const setUserStatus = (status) => {
  currentUserStatus = status
  if (!BrowserWindow) {
    log.debug('No BrowserWindow')
    return
  }
  const mainWindow = BrowserWindow.getFocusedWindow()
  if (mainWindow) {
    mainWindow.webContents.send('user-status', currentUserStatus)
  }
}

export const setUserLoggedIn = () => setUserStatus(USER_STATUS.LOGGED_IN)
export const setUserNoAPIKey = () => setUserStatus(USER_STATUS.NO_API_KEY)
export const setUserInvalidAPIKey = () => setUserStatus(USER_STATUS.INVALID_API_KEY)
