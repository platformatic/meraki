import { test, expect, beforeAll, onTestFinished } from 'vitest'
import { tmpdir } from 'node:os'
import { mkdtemp, cp, rm, access } from 'node:fs/promises'
import { resolve, join } from 'node:path'
import { mkdirp } from 'mkdirp'
import Applications from '../../src/main/lib/applications.mjs'
import Logs from '../../src/main/lib/logs.mjs'
const { request } = require('undici')

// Setup meraki app folder (for migrations) and config folder (for the DB)
const platformaticTestDir = await mkdtemp(join(tmpdir(), 'plat-app-test'))
process.env.MERAKI_FOLDER = resolve(join(__dirname, '..', '..'))
process.env.MERAKI_CONFIG_FOLDER = platformaticTestDir
process.env.MERAKI_DB_CONNECTION_STRING = `sqlite://${join(platformaticTestDir, 'meraki.sqlite')}`

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

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

test('start one runtime and stream logs', async (t) => {
  const appDir = await mkdtemp(join(tmpdir(), 'plat-app-test'))
  const appFixture = join('test', 'fixtures', 'runtime')
  await cp(appFixture, appDir, { recursive: true })

  const applicationsApi = await Applications.create()
  const logs = new Logs(applicationsApi)

  const { id } = await applicationsApi.importApplication(appDir)
  const { runtime, url } = await applicationsApi.startRuntime(id)
  onTestFinished(() => runtime.kill('SIGINT'))

  let receivedLogs = []
  const send = (logs) => {
    receivedLogs.push(...logs)
  }

  logs.start(id, send)
  await sleep(1000)
  logs.stop()
  await applicationsApi.stopRuntime(id)
  expect(receivedLogs.join('\n')).toContain(`Server listening at ${url}`)

  // Pause and resume
  {
    receivedLogs = []
    const { runtime, url } = await applicationsApi.startRuntime(id)
    onTestFinished(() => runtime.kill('SIGINT'))
    logs.start(id, send)
    await sleep(1000)
    expect(receivedLogs.join('\n')).toContain(`Server listening at ${url}`)

    // Let's pause, make some requests and see that logs are not being received
    logs.pause()
    receivedLogs = []
    await request(url)
    await request(url)
    await sleep(1000)
    expect(receivedLogs).toHaveLength(0)
    // Resuming...
    logs.resume()
    await sleep(1000)
    expect(receivedLogs).toHaveLength(4) // 2 logs for each request (incoming and request completed)
    logs.stop()
    await applicationsApi.stopRuntime(id)
  }
}, 60000)
