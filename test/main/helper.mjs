import fastify from 'fastify'
import { afterEach } from 'vitest'
import { access } from 'node:fs/promises'
function setUpEnvironment (env = {}) {
  const defaultEnv = {
    MAIN_VITE_MARKETPLACE_HOST: 'http://localhost:13042',
    MAIN_VITE_USE_MOCKS: false
  }
  Object.assign(process.env, defaultEnv, env)
}

async function startMarketplace (options = {}) {
  const marketplace = fastify({ keepAliveTimeout: 1 })

  marketplace.get('/templates', async (request, reply) => {
    const getStackablesCallback = options.getStackablesCallback || (() => {})
    return getStackablesCallback(request, reply)
  })

  marketplace.get('/plugins', async (request, reply) => {
    const getPluginsCallback = options.getPluginsCallback || (() => {})
    return getPluginsCallback(request, reply)
  })

  afterEach(async () => {
    await marketplace.close()
  })

  return marketplace.listen({ port: 13042 })
}
async function isFileAccessible (filename) {
  try {
    await access(filename)
    return true
  } catch (err) {
    return false
  }
}

export {
  isFileAccessible,
  startMarketplace,
  setUpEnvironment
}
