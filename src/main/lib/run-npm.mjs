'use strict'

import { access } from 'node:fs/promises'
import execa from 'execa'
import { app } from 'electron'
import split from 'split2'
import { dirname } from 'node:path'
import { homedir } from 'node:os'
import log from 'electron-log'

async function isFileAccessible (filename) {
  try {
    await access(filename)
    return true
  } catch (err) {
    return false
  }
}

async function findNpmInShellPath () {
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
    const { stdout } = await execa(currentShell, ['-c', `. ${sourceFile}; which npm`], options)
    binPath = stdout?.trim()
    log.info(`Found npm in PATH after sourcing ${sourceFile}: ${binPath}`)
  } catch (err) {
    log.warn(`Error finding npm in PATH after sourcing ${sourceFile}: ${err.message}`)
  }
  return binPath
}

async function findNpmExec () {
  const npmInPath = await findNpmInShellPath()
  if (npmInPath === null) {
    const paths = [
      '/usr/local/bin/npm',
      '/usr/bin/npm',
      '/bin/npm'
    ]
    for (const location of paths) {
      if (await isFileAccessible(location)) {
        return location
      }
    }
    return null
  }
  return npmInPath
}

async function npmInstall (pkg = null, options, logger) {
  const installOptions = ['install']
  let child = null
  if (pkg) {
    installOptions.push(pkg)
  }

  if (process.platform === 'win32' || !app) {
    log.info('Running in windows, using npm from PATH')
    child = execa('npm', installOptions, options)
  } else {
    // OSx and linux
    const executable = await findNpmExec()
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
