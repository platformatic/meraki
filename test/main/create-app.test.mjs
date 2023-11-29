import { test, beforeEach, expect } from 'vitest'
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

test('Create app with no services should fail', async () => {
  const appDir = await mkdtemp(join(tmpdir(), 'plat-app-test-create'))

  // This is wrong, because we have no services but an entrypoint
  const project = {
    projectName: 'testapp',
    services: [],
    entrypoint: 'main'
  }

  try {
    await createApp(appDir, project, logger)
    test.fails('Should have thrown an error')
  } catch (err) {
    expect(err).toBeInstanceOf(Error)
    expect(err.message).toContain('No services to create')
  }
}, 20000)

test('Create app with no entrypoint should fail', async () => {
  const appDir = await mkdtemp(join(tmpdir(), 'plat-app-test-create'))

  // This is wrong, because we have no services but an entrypoint
  const project = {
    projectName: 'testapp',
    services: ['test']
  }

  try {
    await createApp(appDir, project, logger)
    test.fails('Should have thrown an error')
  } catch (err) {
    expect(err).toBeInstanceOf(Error)
    expect(err.message).toContain('No entrypoint')
  }
}, 20000)
