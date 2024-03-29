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

test('start one runtime and invoke the services', async (t) => {
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
    // inject the server on the runtime entrypoint
    const serviceURL = await proxyApi.start(id)
    const res = await request(`${serviceURL}/documentation/json`)
    const body = await res.body.text()
    const bodyJson = JSON.parse(body)
    expect(res.statusCode).toBe(200)
    const servers = bodyJson.servers
    expect(servers).toHaveLength(1)
    expect(servers[0].url).toMatch('http://localhost:')
    await proxyApi.stop()
  }

  {
    // inject the server for a service that is not the entrypoint
    const serviceURL = await proxyApi.start(id, 'service-1')
    const res = await request(`${serviceURL}/documentation/json`)
    const body = await res.body.text()
    const bodyJson = JSON.parse(body)
    expect(res.statusCode).toBe(200)
    const servers = bodyJson.servers
    expect(servers).toHaveLength(1)
    expect(servers[0].url).toMatch('http://localhost:')
    await proxyApi.stop()
  }

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

  {
    // non existing service id
    const serviceURL = await proxyApi.start(id, 'service-non-existing')
    const res = await request(`${serviceURL}/hello`)
    const body = await res.body.text()
    const bodyJson = JSON.parse(body)
    expect(res.statusCode).toBe(500)
    expect(bodyJson).toEqual({
      statusCode: 500,
      error: 'Internal Server Error',
      message: 'Service not found. Available services are: service-1, service-2'
    })
    await proxyApi.stop()
  }

  {
    // non existent application id
    const id = 'non-existent-id'
    await expect(proxyApi.start(id, 'service-1')).rejects.toThrowError(`Application with id ${id} not found, cannot extract PID`)
  }

  // runtime stopped
  await applicationsApi.stopRuntime(id)
  await expect(proxyApi.start(id, 'service-1')).rejects.toThrowError(`Application with id ${id} is not running`)
}, 60000)
