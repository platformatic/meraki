import { dialog } from 'electron'
import { autoUpdater } from 'electron-updater'
import log from 'electron-log'

let updater = null
autoUpdater.autoDownload = false
log.transports.console.level = 'info'
autoUpdater.logger = log

autoUpdater.on('error', (error) => {
  log.error(error)
})

autoUpdater.on('update-available', async (event) => {
  const { version } = event
  log.info(`Update available: ${version}`)
  const { response } = await dialog.showMessageBox({
    type: 'info',
    title: 'Found Meraki Update',
    message: `Found update: v${version}. Do you want update now?`,
    buttons: ['Sure', 'No']
  })
  if (response === 0) {
    log.info('Downloading now...')
    autoUpdater.downloadUpdate()
  } else {
    if (updater) {
      updater.enabled = true
      updater = null
    }
  }
})

autoUpdater.on('update-not-available', () => {
  log.info('Update not available')

  if (updater) {
    dialog.showMessageBox({
      title: 'No Updates',
      message: 'Current version is up-to-date.'
    })
    updater.enabled = true
    updater = null
  }
})

autoUpdater.on('update-downloaded', async () => {
  log.info('Update downloaded')
  await dialog.showMessageBox({
    title: 'Install Updates',
    message: 'Updates downloaded, application will quit to apply the update'
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

// export this to MenuItem click callback
export async function autoCheckForUpdates () {
  log.info('Checking for updates...')
  try {
    await autoUpdater.checkForUpdates()
  } catch (err) {
    log.error(`Error in checking update: ${err}`)
  }
  log.info('Checking for update done')
}
