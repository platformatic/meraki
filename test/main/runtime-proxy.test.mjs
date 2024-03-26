import { test, expect, beforeAll, onTestFinished } from 'vitest'
import { tmpdir } from 'node:os'
import { mkdtemp, cp, rm, access } from 'node:fs/promises'
import { resolve, join } from 'node:path'
import { mkdirp } from 'mkdirp'
import Applications from '../../src/main/lib/applications.mjs'
import Proxy from '../../src/main/lib/runtime-proxy.mjs'
const { request } = require('undici')

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

test('start one runtime and invoke a service', async (t) => {
  const appDir = await mkdtemp(join(tmpdir(), 'plat-app-test'))
  onTestFinished(() => rm(appDir, { recursive: true }))
  const appFixture = join('test', 'fixtures', 'runtime')
  await cp(appFixture, appDir, { recursive: true })

  const applicationsApi = await Applications.create()
  const proxyApi = new Proxy(applicationsApi)

  const { id } = await applicationsApi.importApplication(appDir)
  const { runtime } = await applicationsApi.startRuntime(id)
  onTestFinished(() => runtime.kill('SIGINT'))

  {
    const serviceURL = await proxyApi.start(id, 'service-1')
    const res = await request(`${serviceURL}/hello`)
    const body = await res.body.text()
    const bodyJson = JSON.parse(body)
    expect(res.statusCode).toBe(200)
    expect(bodyJson).toEqual({ runtime: 'runtime-1', service: 'service-1' })
    await proxyApi.stop()
  }

  {
    const serviceURL = await proxyApi.start(id, 'service-2')
    const res = await request(`${serviceURL}/hello`)
    const body = await res.body.text()
    const bodyJson = JSON.parse(body)
    expect(res.statusCode).toBe(200)
    expect(bodyJson).toEqual({ runtime: 'runtime-1', service: 'service-2' })
    await proxyApi.stop()
  }
}, 60000)
