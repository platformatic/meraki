import { test, expect, beforeAll, onTestFinished } from 'vitest'
import { tmpdir } from 'node:os'
import { mkdtemp, cp, rm, access } from 'node:fs/promises'
import { resolve, join } from 'node:path'
import { mkdirp } from 'mkdirp'
import Runtimes from '../../src/main/lib/runtimes.mjs'

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
  const runtimeApi = await Runtimes.create()
  const applications = await runtimeApi.getApplications()
  expect(applications).toEqual([])
}, 5000)

test('start one runtime, see it in list and stop it', async (t) => {
  const appDir = await mkdtemp(join(tmpdir(), 'plat-app-test'))
  const appFixture = join('test', 'fixtures', 'runtime')
  await cp(appFixture, appDir, { recursive: true })

  const runtimeApi = await Runtimes.create()
  const { runtime } = await runtimeApi.startRuntime(appDir)
  onTestFinished(() => runtime.kill('SIGINT'))

  const applications = await runtimeApi.getApplications()
  expect(applications.length).toBe(1)
  expect(applications[0].running).toBe(true)
  expect(applications[0].name).toBe('runtime-1')
  expect(applications[0].path).toBe(appDir)
  expect(applications[0].runtime.pid).toBe(runtime.pid)

  {
    // Stop the application, is still there, but not running
    await runtimeApi.stopRuntime(runtime.pid)
    const applications = await runtimeApi.getApplications()
    expect(applications.length).toBe(1)
    expect(applications[0].running).toBe(false)
    // Delete the application
    const applicationId = applications[0].id
    await runtimeApi.deleteApplication(applicationId)
    const applicationsAfter = await runtimeApi.getApplications()
    expect(applicationsAfter).toEqual([])
  }
}, 60000)
