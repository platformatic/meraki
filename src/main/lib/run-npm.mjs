'use strict'

import execa from 'execa'
import { app } from 'electron'
import split from 'split2'
import { dirname } from 'node:path'
import log from 'electron-log'
import { findExecutable } from './utils.mjs'
import which from 'which'

async function npmInstall (pkg = null, options, logger) {
  const installOptions = ['install']
  let child = null
  if (pkg) {
    installOptions.push(pkg)
  }

  if (process.platform === 'win32' || !app) {
    log.info('Running in windows, using npm from PATH')
    const npmExec = await which('npm')
    child = execa(npmExec, installOptions, options)
  } else {
    // OSx and linux
    const executable = await findExecutable('npm')
    if (executable === null) {
      throw new Error('Cannot find npm executable')
    }
    log.info(`Running in OSx or Linux, Using npm in ${executable}`)

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

export { npmInstall }
