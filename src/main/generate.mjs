import { stat } from 'node:fs/promises'
import { getPkgManager } from './lib/get-package-manager.mjs'
import { importOrLocal } from './lib/import-or-local.mjs'

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
//     options
//     }
//   ]
// ]
export const createApp = async (projectDir, { projectName, services, entrypoint, port, logLevel, typescript, createGitHubRepository, installGitHubAction }, logger) => {
  const { execa } = await import('execa')
  const { createGitRepository } = await import('create-platformatic')

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
    projectName
  })

  generator.setConfig({
    targetDirectory: projectDir,
    port,
    logLevel,
    typescript, // boolean,
    installGitHubAction
  })

  for (const service of services) {
    const templateName = service.template
    const serviceName = service.name
    const template = await importOrLocal({
      pkgManager,
      projectDir,
      pkg: templateName
    })

    const templateGenerator = new template.Generator()

    templateGenerator.setConfig({
      ...templateGenerator.config,
      serviceName,
      plugin: true,
      tests: true,
      isRuntimeContext: true
    })

    templateGenerator.setConfigFields(service.fields)

    // plugins
    for (const plugin of service.plugins) {
      templateGenerator.addPackage(plugin)
    }

    generator.addService(templateGenerator, serviceName)
  }

  generator.setEntryPoint(entrypoint)
  await generator.prepare()
  await generator.writeFiles()

  if (createGitHubRepository) {
    await createGitRepository(logger, projectDir)
  }

  await execa(pkgManager, ['install'], { cwd: projectDir })

  logger.info('App created!')
}
