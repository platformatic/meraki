import { test, beforeEach, expect, onTestFinished } from 'vitest'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { createApp } from '../../src/main/generate.mjs'
import { mkdtemp, rm } from 'node:fs/promises'
import { isFileAccessible } from './helper.mjs'
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
  onTestFinished(() => rm(appDir, { recursive: true }))

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
  onTestFinished(() => rm(appDir, { recursive: true }))

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

test('Create app', async () => {
  const appDir = await mkdtemp(join(tmpdir(), 'plat-app-test-create'))
  onTestFinished(() => rm(appDir, { recursive: true }))
  const project = {
    projectName: 'electron-testing',
    services: [
      {
        name: 'electron-testing-1',
        template: '@platformatic/service',
        fields: [
          {
            var: 'PLT_SERVER_HOSTNAME',
            value: '125.500.500.0',
            configValue: 'hostname',
            type: 'string'
          },
          {
            var: 'PLT_SERVER_LOGGER_LEVEL',
            value: 'boh',
            configValue: '',
            type: 'string'
          },
          {
            var: 'PORT',
            value: '111111',
            configValue: 'port'
          }
        ],
        plugins: []
      }
    ],

    entrypoint: 'electron-testing-1',
    port: '12312',
    logLevel: 'trace',
    typescript: true,
    createGitHubRepository: true,
    installGitHubAction: true
  }
  try {
    await createApp(appDir, project, logger)
    const expectedFiles = [
      'tsconfig.json',
      'package.json',
      'platformatic.json',
      join('services', 'electron-testing-1', 'platformatic.service.json')
    ]
    for (const file of expectedFiles) {
      expect(await isFileAccessible(join(appDir, file)))
    }
  } catch (err) {
    console.error(err)
    throw err
  }
}, 60000)
