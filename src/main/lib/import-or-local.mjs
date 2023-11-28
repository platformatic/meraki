import { pathToFileURL } from 'node:url'
import path from 'node:path'
import split from 'split2'
import { createRequire } from 'module'

async function importOrLocal ({ pkgManager, projectDir, pkg, logger }) {
  const { execa } = await import('execa')
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

    logger.info({ name: pkg, path: projectDir }, 'Installing ')
    const child = execa(pkgManager, ['install', pkg], { cwd: projectDir })

    child.stdout.pipe(split()).on('data', (line) => {
      logger.info(line)
    })

    child.stderr.pipe(split()).on('data', (line) => {
      logger.error(line)
    })
    await child

    logger.info({ name: pkg, path: projectDir }, 'Installed')
    const fileToImport = _require.resolve(pkg)
    return await import(pathToFileURL(fileToImport))
  }
}

export { importOrLocal }
