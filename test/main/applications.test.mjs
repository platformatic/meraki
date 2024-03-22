import { test, expect, beforeAll, beforeEach, afterAll, onTestFinished } from 'vitest'
import { tmpdir } from 'node:os'
import { mkdtemp, cp, rm, access } from 'node:fs/promises'
import { resolve, join } from 'node:path'
import { mkdirp } from 'mkdirp'
import Applications from '../../src/main/lib/applications.mjs'
import { startRuntimeInFolder } from './helper.mjs'

const { MockAgent, setGlobalDispatcher } = require('undici')

const mockAgent = new MockAgent()
setGlobalDispatcher(mockAgent)
mockAgent.disableNetConnect()

// Setup meraki app folder (for migrations) and config folder (for the DB)
const platformaticTestDir = await mkdtemp(join(tmpdir(), 'plat-app-test'))
process.env.MERAKI_FOLDER = resolve(join(__dirname, '..', '..'))
process.env.MERAKI_CONFIG_FOLDER = platformaticTestDir
process.env.MERAKI_DB_CONNECTION_STRING = `sqlite://${join(platformaticTestDir, 'meraki.sqlite')}`

beforeAll(async () => {
  // we clean up the runtimes folder
  const PLATFORMATIC_TMP_DIR = resolve(tmpdir(), 'platformatic', 'runtimes')
  try {
    await access(PLATFORMATIC_TMP_DIR)
    await rm(PLATFORMATIC_TMP_DIR, { recursive: true })
    await mkdirp(PLATFORMATIC_TMP_DIR)
  } catch (err) {}

  // we clean up the DB
  try {
    await access(platformaticTestDir)
    await rm(platformaticTestDir, { recursive: true })
    await mkdirp(platformaticTestDir)
  } catch (err) {}
})

beforeEach(async () => {
  const sqlitePath = join(platformaticTestDir, 'meraki.sqlite')
  try {
    await access(sqlitePath)
    await rm(sqlitePath)
  } catch (err) {}
})

afterAll(async () => {
  try {
    await rm(platformaticTestDir, { recursive: true })
  } catch (err) {}
})

test('get empty list of runtimes', async () => {
  mockAgent
    .get('https://registry.npmjs.org')
    .intercept({
      method: 'GET',
      path: '/platformatic'
    })
    .reply(200, {
      'dist-tags': {
        latest: '2.0.0'
      }
    })
  const applicationsApi = await Applications.create()
  const applications = await applicationsApi.getApplications()
  expect(applications).toEqual([])
}, 5000)

test('start one runtime, see it in list and stop it', async (t) => {
  const appDir = await mkdtemp(join(tmpdir(), 'plat-app-test'))
  const appFixture = join('test', 'fixtures', 'runtime')
  await cp(appFixture, appDir, { recursive: true })
  mockAgent
    .get('https://registry.npmjs.org')
    .intercept({
      method: 'GET',
      path: '/platformatic'
    })
    .reply(200, {
      'dist-tags': {
        latest: '2.0.0'
      }
    })

  const applicationsApi = await Applications.create()
  const { id } = await applicationsApi.importApplication(appDir)
  const { runtime } = await applicationsApi.startRuntime(id)
  const pid = applicationsApi.getPid(id)
  expect(pid).toBe(runtime.pid)

  onTestFinished(() => runtime.kill('SIGINT'))

  const applications = await applicationsApi.getApplications()
  expect(applications.length).toBe(1)
  expect(applications[0].running).toBe(true)
  expect(applications[0].name).toBe('runtime-1')
  expect(applications[0].path).toBe(appDir)
  expect(applications[0].runtime.pid).toBe(runtime.pid)
  expect(applications[0].insideMeraki).toBe(true)
  expect(applications[0].platformaticVersion).toBe('1.29.0')
  expect(applications[0].isLatestPltVersion).toBe(false)
  expect(applications[0].automaticallyImported).toBe(false)
  {
    // Stop the application, is still there, but not running
    await applicationsApi.stopRuntime(id)
    const applications = await applicationsApi.getApplications()
    expect(applications.length).toBe(1)
    expect(applications[0].running).toBe(false)
    // Delete the application
    await applicationsApi.deleteApplication(id)
    const applicationsAfter = await applicationsApi.getApplications()
    expect(applicationsAfter).toEqual([])
  }

  {
    // Start the  runtime, but with platformatic up-to-date
    mockAgent
      .get('https://registry.npmjs.org')
      .intercept({
        method: 'GET',
        path: '/platformatic'
      })
      .reply(200, {
        'dist-tags': {
          latest: '1.29.0'
        }
      })
    // We get another instance of the APIm because we get the platformatic version once
    // We also need to re-import the app because we deleted it
    const applicationsApi = await Applications.create()
    const { id } = await applicationsApi.importApplication(appDir)
    const { runtime } = await applicationsApi.startRuntime(id)
    onTestFinished(() => runtime.kill('SIGINT'))

    const applications = await applicationsApi.getApplications()
    expect(applications.length).toBe(1)
    expect(applications[0].running).toBe(true)
    expect(applications[0].isLatestPltVersion).toBe(true)
  }
}, 60000)

test('import automatically a running runtime, started externally', async (t) => {
  const appDir = await mkdtemp(join(tmpdir(), 'plat-app-test'))
  const appFixture = join('test', 'fixtures', 'runtime')
  await cp(appFixture, appDir, { recursive: true })
  mockAgent
    .get('https://registry.npmjs.org')
    .intercept({
      method: 'GET',
      path: '/platformatic'
    })
    .reply(200, {
      'dist-tags': {
        latest: '2.0.0'
      }
    })

  const applicationsApi = await Applications.create()

  // We start the runtime but not through the API
  const { runtime } = await startRuntimeInFolder(appDir)
  onTestFinished(() => runtime.kill('SIGINT'))

  const applications = await applicationsApi.getApplications()
  expect(applications.length).toBe(1)
  expect(applications[0].running).toBe(true)
  expect(applications[0].insideMeraki).toBe(false)
  expect(applications[0].automaticallyImported).toBe(true)

  const pid = applicationsApi.getPid(applications[0].id)
  expect(pid).toBe(runtime.pid)
}, 60000)

test('open application', async (t) => {
  const appDir = await mkdtemp(join(tmpdir(), 'plat-app-test'))
  const appFixture = join('test', 'fixtures', 'runtime')
  await cp(appFixture, appDir, { recursive: true })
  mockAgent
    .get('https://registry.npmjs.org')
    .intercept({
      method: 'GET',
      path: '/platformatic'
    })
    .reply(200, {
      'dist-tags': {
        latest: '2.0.0'
      }
    })

  // calls to marketplace. We could batch these
  mockAgent.get('https://marketplace.platformatic.dev').intercept({ method: 'GET', path: '/plugins' }).reply(200, [])
  mockAgent.get('https://marketplace.platformatic.dev').intercept({ method: 'GET', path: '/plugins' }).reply(200, [])
  mockAgent.get('https://marketplace.platformatic.dev').intercept({ method: 'GET', path: '/templates' }).reply(200, [])
  mockAgent.get('https://marketplace.platformatic.dev').intercept({ method: 'GET', path: '/templates' }).reply(200, [])

  const applicationsApi = await Applications.create()
  const { id } = await applicationsApi.importApplication(appDir)

  const applicationDesc = await applicationsApi.openApplication(id)
  delete applicationDesc.$schema

  const expected = {
    id: '1',
    name: 'runtime-1',
    path: appDir,
    running: false,
    status: 'stopped',
    platformaticVersion: null,
    isLatestPltVersion: false,
    runtime: null,
    insideMeraki: false,
    lastStarted: null,
    lastUpdated: applicationDesc.lastUpdated,
    automaticallyImported: false,
    configPath: `${appDir}/platformatic.json`,
    entrypoint: 'service-1',
    port: 3042,
    loggerLevel: 'info',
    services: [
      {
        id: 'service-1',
        path: `${appDir}/services/service-1`,
        configPath: `${appDir}/services/service-1/platformatic.json`,
        config: {
          $schema: 'https://platformatic.dev/schemas/v1.22.0/service',
          service: {
            openapi: true
          },
          plugins: {
            paths: [
              'plugin.js'
            ]
          },
          watch: true,
          metrics: {
            server: 'parent'
          }
        },
        env: {
          PLT_SERVICE_1_CONFIG_PARAM: 'true'
        },
        template: '@platformatic/service',
        templateEnvVariables: [],
        plugins: [],
        pluginsDesc: [],
        templateDesc: []
      },
      {
        id: 'service-2',
        path: `${appDir}/services/service-2`,
        configPath: `${appDir}/services/service-2/platformatic.json`,
        config: {
          $schema: 'https://platformatic.dev/schemas/v1.22.0/service',
          service: {
            openapi: true
          },
          plugins: {
            paths: [
              'plugin.js'
            ]
          }
        },
        env: {
          PLT_SERVICE_2_CONFIG_PARAM: 'false'
        },
        template: '@platformatic/service',
        templateEnvVariables: [],
        plugins: [],
        pluginsDesc: [],
        templateDesc: []
      }
    ]
  }

  delete applicationDesc.config
  expect(applicationDesc).toEqual(expected)
}, 60000)
