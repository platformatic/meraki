import { stat } from 'node:fs/promises'
import { join, resolve } from 'node:path'
import { getPkgManager } from './lib/get-package-manager.mjs'
import { importOrLocal } from './lib/import-or-local.mjs'
import errors from './errors.mjs'
import split from 'split2'
import { mkdirp } from 'mkdirp'
import execa from 'execa'

export const prepareFolder = async (path, tempNames, logger, appName = 'appName') => {
  const s = await stat(path)
  if (!s.isDirectory()) {
    logger.error({ path }, `Path ${path} is not a directory`)
    throw new Error(`Path ${path} is not a directory`)
  }
  const newFolder = join(resolve(path), appName)
  await mkdirp(newFolder)

  const pkgManager = await getPkgManager()
  const templateVariables = {}
  try {
    for (const name of tempNames) {
      const template = await importOrLocal({
        pkgManager,
        projectDir: newFolder,
        pkg: name,
        logger
      })
      // Get the template variables and return them here, if the template has a generator
      if (template.Generator && typeof template.Generator === 'function') {
        const gen = new template.Generator()
        gen.setConfig({
          isRuntimeContext: true
        })
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
export const createApp = async (dir, { projectName, services, entrypoint, port, logLevel, typescript, createGitHubRepository, installGitHubAction }, logger) => {
  const projectDir = join(dir, projectName)

  if (!services || services.length === 0) {
    logger.error('No services to create')
    throw new errors.NoServicesError()
  }

  if (!entrypoint) {
    logger.error('No entrypoint')
    throw new errors.NoEntrypointError()
  }

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

  if (!generator) {
    logger.error('Could not create runtime generator')
    throw new Error('Could not create runtime generator')
  }

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
      pkg: templateName,
      logger
    })

    if (!template) {
      logger.error(`Could not load template ${templateName}`)
      throw new Error(`Could not load template ${templateName}`)
    }

    if (!template.Generator) {
      logger.error(`Template ${templateName} does not have a Generator`)
      throw new Error(`Template ${templateName} does not have a Generator`)
    }

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
    if (service.plugins) {
      for (const plugin of service.plugins) {
        templateGenerator.addPackage(plugin)
      }
    }
    generator.addService(templateGenerator, serviceName)
  }

  generator.setEntryPoint(entrypoint)
  await generator.prepare()
  await generator.writeFiles()

  const child = execa(pkgManager, ['install'], { cwd: projectDir })

  child.stdout.pipe(split()).on('data', (line) => {
    logger.info(line)
  })

  child.stderr.pipe(split()).on('data', (line) => {
    logger.error(line)
  })
  await child

  logger.info('App created!')
}
