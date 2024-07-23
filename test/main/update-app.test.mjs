import { test, beforeEach, onTestFinished, expect } from 'vitest'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { createApp } from '../../src/main/generate.mjs'
import { mkdtemp, rm, writeFile, readdir, readFile } from 'node:fs/promises'
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

test('Create app then update it', async (t) => {
  const appDir = await mkdtemp(join(tmpdir(), 'plat-app-test-create'))
  // onTestFinished(() => rm(appDir, { recursive: true }))
  const projectName = 'testapp'
  const project = {
    projectName,
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

  await createApp(appDir, project, logger)

  let services = await readdir(join(appDir, projectName, 'services'))
  expect(services).toHaveLength(1)
  expect(services).toContain('electron-testing-1')

  // We copy a file to the services folder, the upgrade
  // should just ignore it
  const serviceFile = join(appDir, projectName, 'services', 'ignoreme')
  await writeFile(serviceFile, 'ignoreme')

  project.services.push({
    name: 'electron-testing-2',
    template: '@platformatic/service',
    fields: [],
    plugins: []
  })
  project.entrypoint = 'electron-testing-1'

  // We update it
  await createApp(appDir, project, logger, true)

  services = await readdir(join(appDir, projectName, 'services'))
  expect(services).toHaveLength(3)
  expect(services).toContain('ignoreme')
  expect(services).toContain('electron-testing-2')
  expect(services).toContain('electron-testing-1')
}, 60000)

test('Create app then update it, changing the entrypoint', async (t) => {
  const appDir = await mkdtemp(join(tmpdir(), 'plat-app-test-create'))
  onTestFinished(() => rm(appDir, { recursive: true }))
  const projectName = 'testapp'
  const project = {
    projectName,
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

  await createApp(appDir, project, logger)

  let services = await readdir(join(appDir, projectName, 'services'))
  expect(services).toHaveLength(1)
  expect(services).toContain('electron-testing-1')

  // We copy a file to the services folder, the upgrade
  // should just ignore it
  const serviceFile = join(appDir, projectName, 'services', 'ignoreme')
  await writeFile(serviceFile, 'ignoreme')

  project.services.push({
    name: 'electron-testing-2',
    template: '@platformatic/service',
    fields: [],
    plugins: []
  })
  project.entrypoint = 'electron-testing-2'

  // We update it
  await createApp(appDir, project, logger, true)

  services = await readdir(join(appDir, projectName, 'services'))
  expect(services).toHaveLength(3)
  expect(services).toContain('ignoreme')
  expect(services).toContain('electron-testing-2')
  expect(services).toContain('electron-testing-1')

  const config = await readFile(join(appDir, projectName, 'platformatic.json'), 'utf8')
  expect(JSON.parse(config).entrypoint).toBe('electron-testing-2')
}, 60000)
