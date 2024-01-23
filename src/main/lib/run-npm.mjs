'use strict'

import { access, readFile } from 'node:fs/promises'
import execa from 'execa'
import { app } from 'electron'
import split from 'split2'
import { homedir } from 'node:os'
import { dirname } from 'node:path'

async function isFileAccessible (filename) {
  try {
    await access(filename)
    return true
  } catch (err) {
    return false
  }
}
async function npmInstall (pkg = null, options, logger) {
  const installOptions = ['install']
  let child = null
  if (pkg) {
    installOptions.push(pkg)
  }

  if (process.platform === 'win32' || !app) {
    child = execa('npm', installOptions, options)
  }

  // OSx and linux
  const executable = await findNpmExec()
  if (executable === null) {
    throw new Error('Cannot find npm executable')
  }

  const execDir = dirname(executable)
  const execPath = `/bin:/usr/local/bin:/sbin:/usr/sbin:${execDir}`
  options.env = {
    ...options.env,
    PATH: execPath
  }
  child = execa(executable, installOptions, options)
  if (logger) {
    logger.info(`Found npm in ${executable}`)
    child.stdout.pipe(split()).on('data', (line) => {
      logger.info(line)
    })

    child.stderr.pipe(split()).on('data', (line) => {
      // We don't want to show warnings as errors on ui.
      if (line.includes('npm WARN')) {
        logger.info(line)
      } else {
        logger.error(line)
      }
    })
  }
  await child
}

async function findNpmExec () {
  const npmInNvm = await findNpmInNvm()
  if (npmInNvm === null) {
    const paths = ['/usr/local/bin/npm']
    for (const location of paths) {
      if (await isFileAccessible(location)) {
        return location
      }
    }
    return null
  }
  return npmInNvm
}

async function findNpmInNvm () {
  const nvmDefault = `${homedir()}/.nvm/alias/default`
  if (await isFileAccessible(nvmDefault)) {
    const nodeVersion = await readFile(nvmDefault, 'utf8')
    const npmCandidate = `${homedir()}/.nvm/versions/node/v${nodeVersion.trim()}/bin/npm`
    if (await isFileAccessible(npmCandidate)) {
      return npmCandidate
    }
  }
  return null
}

export { npmInstall }
