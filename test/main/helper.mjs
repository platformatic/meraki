import fastify from 'fastify'
import { afterEach } from 'vitest'

function setUpEnvironment (env = {}) {
  const defaultEnv = {
    MAIN_VITE_DEPLOY_SERVICE_HOST: 'http://localhost:13042',
    MAIN_VITE_USE_MOCKS: false
  }

  Object.assign(process.env, defaultEnv, env)
}

async function startDeployService (options = {}) {
  const deployService = fastify({ keepAliveTimeout: 1 })

  deployService.get('/stackables', async (request, reply) => {
    const getStackablesCallback = options.getStackablesCallback || (() => {})
    return getStackablesCallback(request, reply)
  })

  deployService.get('/plugins', async (request, reply) => {
    const getPluginsCallback = options.getPluginsCallback || (() => {})
    return getPluginsCallback(request, reply)
  })

  afterEach(async () => {
    await deployService.close()
  })

  return deployService.listen({ port: 13042 })
}

export {
  startDeployService,
  setUpEnvironment
}
