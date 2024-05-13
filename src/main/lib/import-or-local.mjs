import { pathToFileURL } from 'node:url'
import path from 'node:path'
import { createRequire } from 'module'
import { npmInstall } from './run-npm.mjs'

async function importOrLocal ({ projectDir, pkg, logger }) {
  if (pkg) {
    pkg = pkg.trim()
  }
  try {
    logger.info(`Installing ${pkg} on ${projectDir}...`)
    await import(pkg)
    logger.info('During installation we found that there are upper folders with node_modules installed or there is a global installation.')
    return null
  } catch (err) {
    // This file does not need to exists, will be created automatically
    const pkgJsonPath = path.join(projectDir, 'package.json')
    const _require = createRequire(pkgJsonPath)

    try {
      const fileToImport = _require.resolve(pkg)
      return await import(pathToFileURL(fileToImport))
    } catch (err) {}

    await npmInstall(pkg, { cwd: projectDir }, logger)

    logger.info({ name: pkg, path: projectDir }, 'Installed!')
    const fileToImport = _require.resolve(pkg)
    return await import(pathToFileURL(fileToImport))
  }
}

export { importOrLocal }
