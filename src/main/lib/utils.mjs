import { app } from 'electron'
import { basename, dirname, resolve } from 'node:path'
import { request } from 'undici'

const isMac = process.platform === 'darwin'

// This file is used to get the root path of the application.
// which is where the extraFiles (so migrations) are stored.
const getAppPath = () => {
  let rootDir = app.getAppPath()
  const last = basename(rootDir)
  if (last === 'app.asar') {
    rootDir = dirname(app.getPath('exe'))
    // In Mac, the executable is /Applications/Meraki.app/Contents/MacOS
    // while migrations is under "Contents"
    if (isMac) {
      rootDir = resolve(rootDir, '..')
    }
  }
  return rootDir
}

async function getLatestPlatformaticVersion (pkg) {
  const res = await request('https://registry.npmjs.org/platformatic')
  if (res.statusCode === 200) {
    const json = await res.body.json()
    return json['dist-tags'].latest
  }
  return null
}

export { getAppPath, getLatestPlatformaticVersion }
