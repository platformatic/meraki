import errors from './errors.mjs'
import { join } from 'path'
import { readFile } from 'node:fs/promises'
import { app, dialog } from 'electron'
import {
  setUserLoggedIn,
  setUserNoAPIKey,
  setUserInvalidAPIKey
} from './user-status.mjs'

import buildMarketplaceClient from './marketplace-client/marketplace-client.mjs'

const marketplaceHost = import.meta.env.MAIN_VITE_MARKETPLACE_HOST || 'https://marketplace.platformatic.dev'

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
async function getStackablesAPI (marketplaceHost, apiKey) {
  try {
    const marketplaceClient = buildMarketplaceClient(marketplaceHost)
    const { statusCode, body } = await marketplaceClient.getTemplates({
      'x-platformatic-user-api-key': apiKey ?? undefined
    })
    if (statusCode === 401 || statusCode === 403) {
    // the user presente an invalid api key
      setUserInvalidAPIKey()
      // If the user is not authorized, we return only the public stackables
      return getStackablesAPI(marketplaceHost)
    } else if (apiKey) {
    // The API key is valid
      setUserLoggedIn()
    }

    if (statusCode !== 200) {
      throw new errors.CannotGetStackablesError(body.message)
    }
    return body
  } catch (error) {
    console.log('Error in getting stackables', error)
    console.log('Error in getting stackables', JSON.stringify(error))
    await dialog.showErrorBox('Error', `Cannot get stackables: ${error}, please check network connection`)
    return [] // We return so the UI stops waiting.
  }
}

async function getPluginsAPI (marketplaceHost, search = '') {
  try {
    const marketplaceClient = buildMarketplaceClient(marketplaceHost)
    const { statusCode, body } = await marketplaceClient.getPlugins({
      search
    })

    if (statusCode !== 200) {
      throw new errors.CannotGetStackablesError()
    }

    return body
  } catch (error) {
    console.log('Error in getting plugins', error)
    await dialog.showErrorBox('Error', `Cannot get plugins: ${error}, please check network connection`)
    return [] // We return so the UI stops waiting.
  }
}

export const getTemplates = async () => {
  const apiKey = await getCurrentApiKey()
  if (!apiKey) {
    setUserNoAPIKey()
  }
  const stackables = await getStackablesAPI(marketplaceHost, apiKey)
  return stackables
}

export const getPlugins = async () => {
  const plugins = await getPluginsAPI(marketplaceHost)
  return plugins
}
