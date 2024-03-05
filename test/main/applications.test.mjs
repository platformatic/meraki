import { test, expect, beforeAll, onTestFinished } from 'vitest'
import { tmpdir } from 'node:os'
import { mkdtemp, cp, rm, access } from 'node:fs/promises'
import { resolve, join } from 'node:path'
import { mkdirp } from 'mkdirp'
import Applications from '../../src/main/lib/applications.mjs'

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
  const PLATFORMATIC_TMP_DIR = resolve(tmpdir(), 'platformatic', 'pids')
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
  onTestFinished(() => runtime.kill('SIGINT'))

  const applications = await applicationsApi.getApplications()
  expect(applications.length).toBe(1)
  expect(applications[0].running).toBe(true)
  expect(applications[0].name).toBe('runtime-1')
  expect(applications[0].path).toBe(appDir)
  expect(applications[0].runtime.pid).toBe(runtime.pid)
  expect(applications[0].insideMeraki).toBe(true)
  expect(applications[0].platformaticVersion).toBe('1.25.0')
  expect(applications[0].isLatestPltVersion).toBe(false)
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
}, 60000)
