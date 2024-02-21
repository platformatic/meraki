import { importOrLocal } from './import-or-local.mjs'
import { constantCase } from 'change-case-all'
import { readFile } from 'node:fs/promises'

// We need to get the service config from the service path
// because we don't want the envs to be resolved
const loadServiceConfig = async (servicePath) => {
  const configPath = `${servicePath}/platformatic.json`
  const serviceConfig = await readFile(configPath, 'utf8')
  return JSON.parse(serviceConfig)
}

const getTemplate = (serviceConfig) => {
  let template
  if (serviceConfig?.$schema?.startsWith('https://platformatic.dev/schemas')) {
    template = serviceConfig?.$schema?.split('/').slice(-1)
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

const inspectApp = async (path) => {
  const { loadConfig, platformaticRuntime } = await importOrLocal({
    projectDir: path,
    pkg: '@platformatic/runtime'
  })

  const configPath = `${path}/platformatic.json`
  const loaded = await loadConfig({}, ['-c', configPath], platformaticRuntime)

  const config = loaded.configManager.current
  const envKeys = Object.keys(loaded.configManager.env)

  const services = []
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
    const plugins = getPlugins(serviceConfig)

    services.push({
      id,
      path: service.path,
      configPath: service.config,
      config: serviceConfig,
      env,
      template,
      plugins
    })
  }

  const runtime = {
    $schema: config.$schema,
    configPath,
    entrypoint: config.entrypoint,
    path,
    services
  }

  return runtime
}

export { inspectApp }
