import { request } from 'undici'
import errors from './errors.mjs'
import { join } from 'path'
import { readFile } from 'node:fs/promises'
import { app } from 'electron'
import {
  setUserLoggedIn,
  setUserNoAPIKey,
  setUserInvalidAPIKey
} from './user-status.mjs'

const deployServiceHost = import.meta.env.MAIN_VITE_DEPLOY_SERVICE_HOST || 'https://deploy.platformatic.cloud'

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
    // the user presente an invalid api key
    setUserInvalidAPIKey()
    // If the user is not authorized, we return only the public stackables
    return getStackablesAPI(deployServiceHost)
  } else if (userApiKey) {
    // The API key is valid
    setUserLoggedIn()
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
  const apiKey = await getCurrentApiKey()
  if (!apiKey) {
    setUserNoAPIKey()
  }
  const stackables = await getStackablesAPI(deployServiceHost, apiKey)
  return stackables
}

export const getPlugins = async () => {
  const plugins = await getPluginsAPI(deployServiceHost)
  return plugins
}
