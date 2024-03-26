import { BrowserWindow } from 'electron'

import log from 'electron-log'

export const sendTemplateId = (templateId) => {
  if (!BrowserWindow) {
    log.debug('No BrowserWindow')
    return
  }

  const mainWindow = BrowserWindow.getFocusedWindow()
  if (mainWindow) {
    log.debug('sending use-template-id', templateId)
    mainWindow.webContents.send('use-template-id', templateId)
  }
}
