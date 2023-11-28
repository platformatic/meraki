import { stat } from 'node:fs/promises'
import { getPkgManager } from './lib/get-package-manager.mjs'
import { importOrLocal } from './lib/import-or-local.mjs'
import { createGitignore, createGitRepository } from 'create-platformatic'

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

// services is an array:
// [
//  {
//  name: 'service-name',
//  template: '@platformatic/service',
//  fields: {
//     // The env
//  },
//  plugins: [
//     {
//     name: 'plugin-name',
//     config
//     }
//   ]
// ]
export const createApp = async (projectDir, { projectName, services, entrypoint, runtimeEnv }, logger) => {
  const { execa } = await import('execa')
  const pkgManager = await getPkgManager()
  const runtime = await importOrLocal({
    pkgManager,
    projectDir,
    pkg: '@platformatic/runtime',
    logger
  })

  if (!runtime || !runtime.Generator) {
    logger.error('Could not load runtime or the runtime Generator')
    return
  }

  const generator = new runtime.Generator({
    projectName,
    services,
    entrypoint,
    runtimeEnv
  })

  generator.setConfig({
    ...generator.config,
    targetDir: projectDir
  })

  for (const service of services) {
    const stackableName = service.stackable
    const serviceName = service.name
    const stackable = await importOrLocal({
      pkgManager,
      projectDir,
      pkg: stackableName
    })

    const stackableGenerator = new stackable.Generator({
    })

    stackableGenerator.setConfig({
      ...stackableGenerator.config,
      serviceName,
      plugin: true,
      tests: true
    })

    generator.addService(stackableGenerator, serviceName)
  }

  generator.setEntryPoint(entrypoint)
  await generator.prepare()
  await generator.writeFiles()

  await createGitignore(logger, projectDir)
  await createGitRepository(logger, projectDir)

  await execa(pkgManager, ['install'], { cwd: projectDir })

  logger.info('App created!')
}
