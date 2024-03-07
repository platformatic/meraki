import { app } from 'electron'
import { basename, dirname, resolve } from 'node:path'
import { access } from 'node:fs/promises'
import { request } from 'undici'
import { homedir } from 'node:os'
import log from 'electron-log'
import execa from 'execa'

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

async function isFileAccessible (filename) {
  try {
    await access(filename)
    return true
  } catch (err) {
    return false
  }
}

async function getLatestPlatformaticVersion (pkg) {
  const res = await request('https://registry.npmjs.org/platformatic')
  if (res.statusCode === 200) {
    const json = await res.body.json()
    return json['dist-tags'].latest
  }
  return null
}

async function findExecutableInShellPath (executableName) {
  const DEFAULT_SHELL = process.platform === 'darwin' ? '/bin/zsh' : '/bin/bash'
  const currentShell = process.env.SHELL || DEFAULT_SHELL
  const homeDir = homedir()
  let sourceFile = `${homeDir}/.zshrc`
  if (currentShell === '/bin/bash') {
    sourceFile = `${homeDir}/bashrc`
  }

  // we need homebrew because in some `.zshrc` files, there are references to binaries installed by homebrew
  // and we need to make sure that those binaries are in the PATH
  const options = {
    env: {
      PATH: '/usr/bin:/bin:/usr/local/bin:/sbin:/usr/sbin:/opt/homebrew/bin'
    }
  }
  let binPath = null
  try {
    const { stdout } = await execa(currentShell, ['-c', `. ${sourceFile}; which ${executableName}`], options)
    binPath = stdout?.trim()
    log.info(`Found ${executableName} in PATH after sourcing ${sourceFile}: ${binPath}`)
  } catch (err) {
    log.warn(`Error finding ${executableName} in PATH after sourcing ${sourceFile}: ${err.message}`)
  }
  return binPath
}

async function findExecutable (executableName) {
  const execInPath = await findExecutableInShellPath(executableName)
  if (execInPath === null) {
    const paths = [
      `/usr/local/bin/${executableName}`,
      `/usr/bin/${executableName}`,
      `/bin/${executableName}`
    ]
    for (const location of paths) {
      if (await isFileAccessible(location)) {
        return location
      }
    }
    return null
  }
  return execInPath
}

export { getAppPath, getLatestPlatformaticVersion, findExecutable, isFileAccessible }
