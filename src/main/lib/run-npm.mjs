'use strict'

import { execa } from 'execa'
import { app } from 'electron'
import split from 'split2'
import { dirname } from 'node:path'
import { findNpmExecutable } from './utils.mjs'
import { stat } from 'fs/promises'

async function npmInstall (pkg = null, options, logger) {
  // if cwd is not a folder, npm install will fail.
  const folder = options.cwd

  if (!folder) {
    logger.error('cwd is not defined')
    return
  }
  const s = await stat(folder)
  if (!s.isDirectory()) {
    logger.info(`Path ${folder} is not a directory, not running npm install`)
    return
  }

  const installOptions = ['install']
  let child = null
  if (pkg) {
    installOptions.push(pkg)
  }

  const npmExec = await findNpmExecutable()

  if (process.platform === 'win32' || !app) {
    child = execa(npmExec, installOptions, options)
  } else {
    const execDir = dirname(npmExec)
    const execPath = `/bin:/usr/local/bin:/sbin:/usr/sbin:${execDir}`
    options.env = {
      ...options.env,
      PATH: execPath
    }
    child = execa(npmExec, installOptions, options)
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
