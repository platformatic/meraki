import { pathToFileURL } from 'node:url'
import path from 'node:path'
import { createRequire } from 'module'
import { spawn } from 'node:child_process'

async function importOrLocal ({ pkgManager, projectDir, pkg, logger }) {
  const resourcesPath = process.resourcesPath
  const npmPackagePath = path.join(
    resourcesPath, '..', 'node_modules', 'npm', 'bin', 'npm-cli.js'
  )

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

    logger.info({ name: pkg, path: projectDir }, `Installing ${pkg} on ${projectDir}...`)

    const child = spawn(process.env.SHELL, ['-c', `. ~/.zshrc; npm i ${pkg}`], {
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
      console.log(err)
    })

    return new Promise((resolve, reject) => {
      child.on('exit', async () => {
        try {
          logger.info({ name: pkg, path: projectDir }, 'Installed!')
          const fileToImport = _require.resolve(pkg)
          logger.info(fileToImport)
          logger.info(pathToFileURL(fileToImport))
          const pathToPkg = await import(pathToFileURL(fileToImport))
          resolve(pathToPkg)
        } catch (err) {
          reject(err)
        }
      })
    })
  }
}

export { importOrLocal }
