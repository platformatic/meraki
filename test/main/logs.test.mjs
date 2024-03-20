import { test, expect, beforeAll, onTestFinished } from 'vitest'
import { tmpdir } from 'node:os'
import { mkdtemp, cp, rm, access, writeFile } from 'node:fs/promises'
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
    await sleep(1500)
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

test('all logs', async (t) => {
  const appDir = await mkdtemp(join(tmpdir(), 'plat-app-test'))
  const appFixture = join('test', 'fixtures', 'runtime')
  await cp(appFixture, appDir, { recursive: true })

  const applicationsApi = await Applications.create()
  const logs = new Logs(applicationsApi)
  const { id } = await applicationsApi.importApplication(appDir)

  const { runtime, url } = await applicationsApi.startRuntime(id)
  onTestFinished(() => runtime.kill('SIGINT'))

  // Write some log files
  const PLATFORMATIC_TMP_DIR = resolve(tmpdir(), 'platformatic', 'runtimes')
  const runtimeTmpDir = join(PLATFORMATIC_TMP_DIR, runtime.pid.toString())
  const testLog1 = 'test-logs-1\n'
  await writeFile(join(runtimeTmpDir, 'logs.1'), testLog1)
  const testLog2 = 'test-logs-2\n'
  await writeFile(join(runtimeTmpDir, 'logs.2'), testLog2)
  const testLog3 = 'test-logs-3\n'
  await writeFile(join(runtimeTmpDir, 'logs.3'), testLog3)

  await sleep(2000)
  await request(url)
  await sleep(1000)

  const logsURL = await logs.getAllLogsURL(id)
  const response = await request(logsURL)
  const body = await response.body.text()
  expect(body).toContain('test-logs-1')
  // this is actually appended to the "1" file because it's not filled.
  expect(body).toContain(`Server listening at ${url}`)
  expect(body).toContain('test-logs-2')
  expect(body).toContain('test-logs-3')
}, 60000)

test('previous logs', async (t) => {
  const appDir = await mkdtemp(join(tmpdir(), 'plat-app-test'))
  const appFixture = join('test', 'fixtures', 'runtime')
  await cp(appFixture, appDir, { recursive: true })

  const applicationsApi = await Applications.create()
  const logs = new Logs(applicationsApi)

  const { id } = await applicationsApi.importApplication(appDir)

  const receivedLogs = []
  const send = (logs) => {
    receivedLogs.push(...logs)
  }

  const { runtime } = await applicationsApi.startRuntime(id)
  onTestFinished(() => runtime.kill('SIGINT'))

  // Write some log files
  const PLATFORMATIC_TMP_DIR = resolve(tmpdir(), 'platformatic', 'runtimes')
  const runtimeTmpDir = join(PLATFORMATIC_TMP_DIR, runtime.pid.toString())
  const testLog1 = 'test-logs-1\n'
  await writeFile(join(runtimeTmpDir, 'logs.1'), testLog1)
  const testLog2 = 'test-logs-2\n'
  await writeFile(join(runtimeTmpDir, 'logs.2'), testLog2)
  const testLog3 = 'test-logs-3\n'
  await writeFile(join(runtimeTmpDir, 'logs.3'), testLog3)

  logs.start(id, send)
  await sleep(1500)
  expect(receivedLogs.join('\n')).toContain('test-logs-3')
  const prevLogs2 = await logs.getPreviousLogs(id)
  expect(prevLogs2).toContain('test-logs-2')
  const prevLogs1 = await logs.getPreviousLogs(id)
  expect(prevLogs1).toContain('test-logs-1')
  logs.stop()
  await applicationsApi.stopRuntime(id)
}, 60000)
