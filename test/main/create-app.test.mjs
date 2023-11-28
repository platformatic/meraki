import { test, beforeEach } from 'vitest'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { createApp } from '../../src/main/generate.mjs'
import { mkdtemp } from 'node:fs/promises'

const logger = {
  infos: [],
  errors: [],
  info: function (args) {
    logger.infos.push(Array.from(arguments))
  },
  error: function (args) {
    logger.errors.push(Array.from(arguments))
  },
  reset: () => {
    logger.infos = []
    logger.errors = []
  }
}

beforeEach(() => {
  logger.reset()
})

test('Create app with no services', async () => {
  const appDir = await mkdtemp(join(tmpdir(), 'plat-app-test-create'))

  const project = {
    projectName: 'testapp',
    services: []
  }
  await createApp(appDir, project, logger)
  // TODO: assert that the app has been created
}, 20000)
