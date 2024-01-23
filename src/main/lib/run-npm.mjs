'use strict'

import { access } from 'node:fs/promises'
import execa from 'execa'
import { app } from 'electron'
import split from 'split3'
import { homedir } from 'node:os'
import { dirname } from 'node:path'
import log from 'electron-log'

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
    log.info('Running in windows')
    child = execa('npm', installOptions, options)
  } else {
    // OSx and linux
    log.info('Running in OSx or linux')
    const executable = await findNpmExec()
    log.info(`Found npm in ${executable}`)
    if (executable === null) {
      throw new Error('Cannot find npm executable')
    }
    log.info(`Found npm in ${executable}`)

    const execDir = dirname(executable)
    const execPath = `/bin:/usr/local/bin:/sbin:/usr/sbin:${execDir}`
    options.env = {
      ...options.env,
      PATH: execPath
    }
    child = execa(executable, installOptions, options)
  }
  if (logger) {
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
  log.info(`Found npm in nvm ${npmInNvm}`)
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
  try {
    if (await isFileAccessible(`${homedir()}/.nvm/nvm.sh`)) {
      const execPath = '/bin:/usr/local/bin:/sbin:/usr/sbin:/usr/bin'
      const executable = `. ${homedir()}/.nvm/nvm.sh; nvm which current`
      const options = {
        env: {
          PATH: execPath,
          NVM_DIR: `${homedir()}/.nvm`
        },
        shell: true
      }
      const { stdout } = await execa(executable, [], options)
      const binPath = stdout.trim()
      const npmCandidate = binPath.replace('/bin/node', '/bin/npm')
      if (await isFileAccessible(npmCandidate)) {
        log.info(`Found npm in nvm ${npmCandidate}`)
        return npmCandidate
      }
    } else {
      log.info('Npm in nvm not found')
    }
  } catch (err) {
    log.error(err)
  }
  return null
}

export { npmInstall }
