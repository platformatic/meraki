import { test, expect, beforeAll, onTestFinished } from 'vitest'
import { tmpdir } from 'node:os'
import { mkdtemp, cp, rm, access } from 'node:fs/promises'
import { resolve, join } from 'node:path'
import { mkdirp } from 'mkdirp'
import Runtimes from '../../src/main/lib/runtimes.mjs'

beforeAll(async () => {
  // we clean up the runtimes folder
  const PLATFORMATIC_TMP_DIR = resolve(tmpdir(), 'platformatic', 'pids')
  try {
    await access(PLATFORMATIC_TMP_DIR)
    await rm(PLATFORMATIC_TMP_DIR, { recursive: true })
    await mkdirp(PLATFORMATIC_TMP_DIR)
  } catch (err) {}
})

// const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

test('get empty list of runtimes', async () => {
  const runtimeApi = new Runtimes()
  const runtimes = await runtimeApi.getRuntimes()
  expect(runtimes).toEqual([])
}, 5000)

test('start one runtime, see it in list and stop it', async (t) => {
  const appDir = await mkdtemp(join(tmpdir(), 'plat-app-test'))
  const appFixture = join('test', 'fixtures', 'runtime')
  await cp(appFixture, appDir, { recursive: true })

  const runtimeApi = new Runtimes()
  const { runtime } = await runtimeApi.startRuntime(appDir)
  onTestFinished(() => runtime.kill('SIGINT'))

  const runtimes = await runtimeApi.getRuntimes()
  expect(runtimes.length).toBe(1)
  expect(runtimes[0].pid).toBe(runtime.pid)
  expect(runtimes[0].projectDir).toBe(appDir)
  {
    await runtimeApi.stopRuntime(runtime.pid)
    const runtimes = await runtimeApi.getRuntimes()
    expect(runtimes).toEqual([])
  }
}, 60000)
