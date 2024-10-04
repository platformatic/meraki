import { importOrLocal } from './import-or-local.mjs'
import { constantCase } from 'change-case-all'
import { readFile } from 'node:fs/promises'
import { getPlugins as getMarketPlugins, getTemplates as getMarketTemplates } from '../client.mjs'
import logger from 'electron-log'
import { join } from 'node:path'

// We need to get the service config from the service path
// because we don't want the envs to be resolved
const loadServiceConfig = async (servicePath) => {
  const configPath = join(servicePath, 'platformatic.json')
  const serviceConfig = await readFile(configPath, 'utf8')
  return JSON.parse(serviceConfig)
}

const getTemplate = (serviceConfig) => {
  console.log('serviceConfig', serviceConfig.$schema)
  // TODO: support both schemas
  let template
  if (serviceConfig?.$schema?.startsWith('https://platformatic.dev/schemas')) {
    template = serviceConfig?.$schema?.split('/').slice(-1)
    template = `@platformatic/${template}`
  } else if (serviceConfig?.$schema?.startsWith('https://schemas.platformatic.dev')) {
    template = serviceConfig?.$schema?.split('https://schemas.platformatic.dev/@platformatic/')[1]
    template = template.split('/')[0]
    template = `@platformatic/${template}`
  } else {
    template = serviceConfig?.module || serviceConfig?.extends
  }
  return template
}

const getPlugins = (serviceConfig) => {
  const plugins = serviceConfig?.plugins?.packages || []
  return plugins
}

const getEnvVariables = async (projectDir, name) => {
  try {
    const template = await importOrLocal({
      projectDir,
      pkg: name,
      logger
    })
    // Get the template variables and return them here, if the template has a generator
    if (template.Generator && typeof template.Generator === 'function') {
      const gen = new template.Generator()
      gen.setConfig({
        isRuntimeContext: true
      })
      return gen.getConfigFieldsDefinitions()
    }
  } catch (err) {
    logger.error(err)
    throw err
  }
}

const inspectApp = async (path) => {
  const { loadConfig, platformaticRuntime } = await importOrLocal({
    projectDir: path,
    pkg: '@platformatic/runtime',
    logger
  })

  const configPath = join(path, 'platformatic.json')
  const loaded = await loadConfig({}, ['-c', configPath], platformaticRuntime)

  const config = loaded.configManager.current
  const port = config.server?.port
  const loggerLevel = config.server?.logger?.level
  const envKeys = Object.keys(loaded.configManager.env)

  const services = []
  let entryPointService
  for (const service of config.services) {
    const id = service.id
    const configKey = `PLT_${constantCase(id)}`
    const envServiceKeys = envKeys.filter((key) => key.startsWith(configKey))

    const env = envServiceKeys.reduce((acc, key) => {
      acc[key] = loaded.configManager.env[key]
      return acc
    }, {})

    const serviceConfig = await loadServiceConfig(service.path)
    const template = getTemplate(serviceConfig)
    const templateEnvVariables = await getEnvVariables(path, template)
    const plugins = getPlugins(serviceConfig)
    const pluginNames = plugins.map((plugin) => plugin.name)
    const pluginsDesc = await getMarketPlugins(pluginNames)
    const templateDesc = await getMarketTemplates([template])

    const meta = {
      id,
      path: service.path,
      configPath: service.config,
      config: serviceConfig,
      env,
      template,
      plugins,
      templateEnvVariables,
      pluginsDesc,
      templateDesc
    }
    if (id === config.entrypoint) {
      entryPointService = meta
    } else {
      services.push(meta)
    }
  }

  const runtime = {
    $schema: config.$schema,
    configPath,
    config,
    port,
    loggerLevel,
    entrypoint: config.entrypoint,
    path,
    services: [entryPointService, ...services]
  }

  return runtime
}

export { inspectApp }
