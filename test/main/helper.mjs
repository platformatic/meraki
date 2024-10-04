import fastify from 'fastify'
import { execa } from 'execa'
import { afterEach } from 'vitest'
import { access } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { join } from 'node:path'
import { npmInstall } from '../../src/main/lib/run-npm.mjs'
import split from 'split2'
import pino from 'pino'
const logger = pino()

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

  const url = await marketplace.listen({ port: 13042 })
  return { url, marketplace }
}

async function isFileAccessible (filename) {
  try {
    await access(filename)
    return true
  } catch (err) {
    return false
  }
}

async function startRuntimeInFolder (appFolder) {
  await npmInstall(null, { cwd: appFolder }, logger)
  const configFile = join(appFolder, 'platformatic.json')

  const pkgJsonPath = join(appFolder, 'package.json')
  const _require = createRequire(pkgJsonPath)
  const runtimeCliPath = _require.resolve('@platformatic/runtime/runtime.mjs')

  const runtime = execa(
    process.execPath, [runtimeCliPath, 'start', '-c', configFile],
    { cleanup: true, cwd: appFolder }
  )
  runtime.stdout.pipe(process.stdout)
  runtime.stderr.pipe(process.stderr)

  const output = runtime.stdout.pipe(split(function (line) {
    try {
      const obj = JSON.parse(line)
      return obj
    } catch (err) {
      logger.error(err)
    }
  }))

  const errorTimeout = setTimeout(() => {
    throw new Error('Couldn\'t start server')
  }, 30000)

  // Here we check every message of the runtime output only to check if the runtime is started
  for await (const message of output) {
    if (message.msg) {
      const url = message.url ??
          message.msg.match(/server listening at (.+)/i)?.[1]

      if (url !== undefined) {
        clearTimeout(errorTimeout)
        return { runtime, url }
      }
    }
  }
}

export {
  isFileAccessible,
  startMarketplace,
  setUpEnvironment,
  startRuntimeInFolder
}
