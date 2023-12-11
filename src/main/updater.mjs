import { dialog } from 'electron'
import { autoUpdater } from 'electron-updater'
import log from 'electron-log'

let updater
autoUpdater.autoDownload = false
log.transports.console.level = 'info'
autoUpdater.logger = log

autoUpdater.on('error', (error) => {
  log.error(error)
  dialog.showErrorBox('Error: ', error == null ? 'unknown' : (error.stack || error).toString())
})

autoUpdater.on('update-available', async () => {
  log.info('Update available')
  const buttonIndex = await dialog.showMessageBox({
    type: 'info',
    title: 'Found Meraki Update',
    message: 'Found update, do you want update now?',
    buttons: ['Sure', 'No']
  })
  if (buttonIndex === 0) {
    autoUpdater.downloadUpdate()
  } else {
    updater.enabled = true
    updater = null
  }
})

autoUpdater.on('update-not-available', () => {
  log.info('Update not available')
  dialog.showMessageBox({
    title: 'No Updates',
    message: 'Current version is up-to-date.'
  })
  updater.enabled = true
  updater = null
})

autoUpdater.on('update-downloaded', async () => {
  log.info('Update downloaded')
  await dialog.showMessageBox({
    title: 'Install Updates',
    message: 'Updates downloaded, application will be quit for update...'
  })
  autoUpdater.quitAndInstall()
})

// export this to MenuItem click callback
export function checkForUpdates (menuItem, focusedWindow, event) {
  updater = menuItem
  updater.enabled = false
  log.info('Checking for updates...')
  autoUpdater.checkForUpdates()
  log.info('Checking for updates...done')
}
