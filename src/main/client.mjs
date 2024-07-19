import errors from './errors.mjs'
import { dialog } from 'electron'

import buildMarketplaceClient from './marketplace-client/marketplace-client.mjs'

const marketplaceHost = import.meta.env.MAIN_VITE_MARKETPLACE_HOST || 'https://marketplace.platformatic.dev'

// User API key is optional. If passed we used it to retrieve also the private stackables
async function getStackablesAPI (marketplaceHost) {
  try {
    const marketplaceClient = buildMarketplaceClient(marketplaceHost)
    const { statusCode, body } = await marketplaceClient.getTemplates({})

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

export const getTemplates = async (names) => {
  // TODO: pass the names to the API, we need to change the API to accept an array of names
  const stackables = await getStackablesAPI(marketplaceHost)
  if (names) {
    return stackables.filter((stackable) => names.includes(stackable?.name))
  }
  return stackables
}

export const getPlugins = async (names) => {
  const plugins = await getPluginsAPI(marketplaceHost)
  // TODO: pass the names to the API, we need to change the API to accept an array of names
  if (names) {
    return plugins.filter((plugin) => names.includes(plugin?.name))
  }
  return plugins
}
