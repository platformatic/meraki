import { test, expect, beforeAll, afterAll, onTestFinished } from 'vitest'
import { tmpdir } from 'node:os'
import { mkdtemp, cp, rm, access } from 'node:fs/promises'
import { resolve, join } from 'node:path'
import { mkdirp } from 'mkdirp'
import Applications from '../../src/main/lib/applications.mjs'
import Metrics from '../../src/main/lib/metrics.mjs'

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

afterAll(async () => {
  await rm(platformaticTestDir, { recursive: true })
})

test('start one runtime and stream metrics', async (t) => {
  const appDir = await mkdtemp(join(tmpdir(), 'plat-app-test'))
  onTestFinished(() => rm(appDir, { recursive: true, force: true }))
  const appFixture = join('test', 'fixtures', 'runtime')
  await cp(appFixture, appDir, { recursive: true })

  const applicationsApi = await Applications.create()
  const metrics = new Metrics(applicationsApi)

  const { id } = await applicationsApi.importApplication(appDir)
  const { runtime } = await applicationsApi.startRuntime(id)
  await sleep(2500)
  onTestFinished(() => runtime.kill('SIGINT'))

  const receivedMetrics = []
  const send = (metric) => {
    receivedMetrics.push(metric)
  }

  metrics.start(id, send)
  await sleep(2000)
  metrics.stop()
  await applicationsApi.stopRuntime(id)
  // We cannot assert the content of the metrics, but we can assert that we received some
  expect(receivedMetrics.length).toBeGreaterThan(0)
  const firstMetric = JSON.parse(receivedMetrics[0])
  expect(firstMetric).toHaveProperty('cpu')
  expect(firstMetric).toHaveProperty('elu')
  expect(firstMetric).toHaveProperty('rss')
  expect(firstMetric).toHaveProperty('totalHeapSize')
  expect(firstMetric).toHaveProperty('usedHeapSize')
  expect(firstMetric).toHaveProperty('newSpaceSize')
  expect(firstMetric).toHaveProperty('oldSpaceSize')
  expect(firstMetric).toHaveProperty('entrypoint')
}, 60000)
