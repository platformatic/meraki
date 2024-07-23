import { stat, readdir, readFile, writeFile } from 'node:fs/promises'
import { join, resolve } from 'node:path'
import { importOrLocal } from './lib/import-or-local.mjs'
import errors from './errors.mjs'
import { mkdirp } from 'mkdirp'
import { npmInstall } from './lib/run-npm.mjs'

const enableManagementAPI = async (projectDir) => {
  const config = join(projectDir, 'platformatic.json')
  const platformaticConfig = await readFile(config, 'utf8')
  const platformaticConf = JSON.parse(platformaticConfig)
  if (platformaticConf.managementApi === undefined) {
    platformaticConf.managementApi = true
  }
  await writeFile(config, JSON.stringify(platformaticConf, null, 2))
}

export const prepareFolder = async (path, tempNames, logger, appName = 'appName') => {
  const s = await stat(path)
  if (!s.isDirectory()) {
    logger.error({ path }, `Path ${path} is not a directory`)
    throw new Error(`Path ${path} is not a directory`)
  }
  let newFolder = path
  if (!newFolder.endsWith(appName)) {
    newFolder = join(resolve(path), appName)
  }
  await mkdirp(newFolder)
  const templateVariables = {}
  try {
    for (const name of tempNames) {
      const template = await importOrLocal({
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
export const createApp = async (dir, { projectName, services, entrypoint, port, logLevel, typescript, createGitHubRepository, installGitHubAction }, logger, isUpdate = false) => {
  let projectDir = dir
  if (!projectDir.endsWith(projectName)) {
    projectDir = join(dir, projectName)
  }

  mkdirp.sync(projectDir)
  if (!services || services.length === 0) {
    logger.error('No services to create')
    throw new errors.NoServicesError()
  }

  if (!entrypoint) {
    logger.error('No entrypoint')
    throw new errors.NoEntrypointError()
  }

  const runtime = await importOrLocal({
    projectDir,
    pkg: '@platformatic/runtime',
    logger
  })

  if (!runtime || !runtime.Generator) {
    logger.error('Could not load runtime or the runtime Generator')
    return
  }

  const generator = new runtime.Generator({
    logger,
    name: projectName
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

  if (!isUpdate) {
    for (const service of services) {
      const templateName = service.template
      const serviceName = service.name
      const template = await importOrLocal({
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

      const templateGenerator = new template.Generator({
        logger
      })

      templateGenerator.setConfig({
        ...templateGenerator.getDefaultConfig(),
        serviceName,
        isRuntimeContext: true
      })

      templateGenerator.setConfigFields(service.fields)

      // plugins
      if (service.plugins) {
        for (const plugin of service.plugins) {
          await templateGenerator.addPackage(plugin)
        }
      }
      generator.addService(templateGenerator, serviceName)
    }
  }

  if (!isUpdate) {
    // Creation
    generator.setEntryPoint(entrypoint)
    await generator.prepare()
    await generator.writeFiles()
  } else {
    await generator.loadFromDir()
    await generator.update({ services })
    generator.setEntryPoint(entrypoint)
    // We need to call this twice becasue the `setEntryPoint` fails if the service is "uknonwn".
    // This is basically a workaround for a bug in the runtime,
    await generator.update({ services })
  }

  await npmInstall(null, { cwd: projectDir }, logger)

  const serviceFolders = await readdir(join(projectDir, 'services'))
  for (const serviceFolder of serviceFolders) {
    const servicePath = join(projectDir, 'services', serviceFolder)
    await npmInstall(null, { cwd: servicePath }, logger)
  }

  await generator.postInstallActions()

  await enableManagementAPI(projectDir)

  logger.info('App created!')
}
