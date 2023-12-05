import { pathToFileURL } from 'node:url'
import path from 'node:path'
import split from 'split2'
import { createRequire } from 'module'
import { spawn } from 'node:child_process'
import execa from 'execa'

async function importOrLocal ({ pkgManager, projectDir, pkg, logger }) {
  try {
    return await import(pkg)
  } catch (err) {
    // This file does not need to exists, will be created automatically
    const pkgJsonPath = path.join(projectDir, 'package.json')
    const _require = createRequire(pkgJsonPath)

    try {
      const fileToImport = _require.resolve(pkg)
      return await import(pathToFileURL(fileToImport))
    } catch (err) {}

    logger.info(`Installing ${pkg} on ${projectDir}...`)

    if (process.platform === 'win32') {
      const child = execa(pkgManager, ['install', pkg], { cwd: projectDir })

      child.stdout.pipe(split()).on('data', (line) => {
        logger.info(line)
      })

      child.stderr.pipe(split()).on('data', (line) => {
        logger.error(line)
      })
      await child

      logger.info({ name: pkg, path: projectDir }, 'Installed!')
      const fileToImport = _require.resolve(pkg)
      return await import(pathToFileURL(fileToImport))
    } else {
      // OSx and linux
      const currentShell = process.env.SHELL || '/bin/zsh'
      let sourceFile = '~/.zshrc'
      if (currentShell === '/bin/bash') {
        sourceFile = '~./bashrc'
      }

      const child = spawn(process.env.SHELL, ['-c', `. ${sourceFile}; npm i ${pkg}`], {
        cwd: projectDir
      })

      child.stdout.setEncoding('utf8')
      child.stdout.on('data', (message) => {
        logger.info(message)
        console.log(message)
      })

      child.stderr.setEncoding('utf8')
      child.stderr.on('data', (message) => {
        logger.info(message)
        console.log(message)
      })

      child.on('error', async (err) => {
        logger.error(err)
      })

      return new Promise((resolve, reject) => {
        child.on('exit', async () => {
          try {
            logger.info('Installed!')
            const fileToImport = _require.resolve(pkg)
            const pathToPkg = await import(pathToFileURL(fileToImport))
            resolve(pathToPkg)
          } catch (err) {
            reject(err)
          }
        })
      })
    }
  }
}

export { importOrLocal }
