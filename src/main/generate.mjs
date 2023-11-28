import { stat } from 'node:fs/promises'
import { getPkgManager } from './lib/get-package-manager.mjs'
import { importOrLocal } from './lib/import-or-local.mjs'
// import { createGitignore, createGitRepository } from 'create-platformatic'

export const prepareFolder = async (path, tempNames, logger) => {
  const s = await stat(path)
  if (!s.isDirectory()) {
    logger.error({ path }, `Path ${path} is not a directory`)
    throw new Error(`Path ${path} is not a directory`)
  }

  const pkgManager = await getPkgManager()
  const templateVariables = {}
  try {
    for (const name of tempNames) {
      const template = await importOrLocal({
        pkgManager,
        projectDir: path,
        pkg: name,
        logger
      })
      // Get the template variables and return them here, if the template has a generator
      if (template.Generator && typeof template.Generator === 'function') {
        const gen = new template.Generator()
        templateVariables[name] = gen.getConfigFieldsDefinitions()
      }
    }
  } catch (err) {
    logger.error(err)
    throw err
  }
  return templateVariables
}

export const createApp = async (path, services, logger) => {
  const pkgManager = await getPkgManager()
  const runtime = await importOrLocal({
    pkgManager,
    projectDir: path,
    pkg: '@platformatic/runtime',
    logger
  })
  console.log(runtime)
  // TODO: actual app creation. We need to (re)write something like this one:
  // https://github.com/platformatic/platformatic/pull/1847/files#diff-102ae7288ada2a8971e9a6f525caed5eb384528b0783c3b901326593e2486f19R36-R118
  logger.info('App created!')
}
