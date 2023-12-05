import { request } from 'undici'
import errors from './errors.mjs'
import ossTemplates from './oss_templates.mjs'
import { join } from 'path'
import { readFile } from 'node:fs/promises'
import { createRequire } from 'module'
import { app } from 'electron'

const require = createRequire(import.meta.url)

const mockedPlugins = require('../../__mocks__/plugins.json')
const mockedTemplates = require('../../__mocks__/templates.json')
const mockedVars = require('../../__mocks__/pluginvars.json')

const deployServiceHost = import.meta.env.MAIN_VITE_DEPLOY_SERVICE_HOST || 'https://deploy.platformatic.cloud'
const useMocks = import.meta.env.MAIN_VITE_USE_MOCKS === 'true'

const getCurrentApiKey = async () => {
  let platformaticHome
  if (app) {
    platformaticHome = app.getPath('home')
  } else {
    // unit tests
    platformaticHome = process.env.HOME
  }
  const pltDirPath = join(platformaticHome, '.platformatic')
  const configPath = join(pltDirPath, 'config.json')
  let configFile
  try {
    configFile = await readFile(configPath, 'utf8')
  } catch (err) {
    // The file does not exist or is not readeable.
    if (err.code === 'ENOENT') {
      console.log('Config file not found')
    }
    return null
  }
  let config
  try {
    config = JSON.parse(configFile)
  } catch (err) {
    throw new errors.ConfigNotParsableError(configPath)
  }
  return config.userApiKey
}

// User API key is optional. If passed we used it to retrieve also the private stackables
async function getStackablesAPI (deployServiceHost, userApiKey = null) {
  const url = deployServiceHost + '/stackables'

  const headers = {
    'content-type': 'application/json'
  }

  if (userApiKey) {
    headers['x-platformatic-user-api-key'] = userApiKey
  }

  const { statusCode, body } = await request(url, {
    method: 'GET',
    headers
  })

  if (statusCode === 401) {
    // If the user is not authorized, we return only the public stackables
    // TODO: we should show the "login" status in the UI in some way, missing design.
    return getStackablesAPI(deployServiceHost)
  }

  if (statusCode !== 200) {
    const error = await body.json()
    console.log('Cannot get stackables', error)
    throw new errors.CannotGetStackablesError(error.message)
  }
  const stackables = await body.json()
  return stackables
}

async function getPluginsAPI (deployServiceHost) {
  const url = deployServiceHost + '/plugins'

  const { statusCode, body } = await request(url, {
    method: 'GET',
    headers: {
      'content-type': 'application/json'
    }
  })

  if (statusCode !== 200) {
    throw new errors.CannotGetStackablesError()
  }

  const plugins = await body.json()
  return plugins
}

export const getTemplates = async () => {
  if (useMocks) {
    const stackables = mockedTemplates.map(template => ({
      ...template
    }))
    return [
      ...ossTemplates,
      ...stackables
    ]
  }
  const apiKey = await getCurrentApiKey()
  const stackables = await getStackablesAPI(deployServiceHost, apiKey)
  const templates = [
    ...ossTemplates,
    ...stackables
  ]
  return templates
}

export const getPlugins = async () => {
  if (useMocks) {
    return mockedPlugins.map(plugin => ({
      ...plugin,
      envVars: [...mockedVars]
    }))
  }
  const plugins = await getPluginsAPI(deployServiceHost)
  return plugins
}
