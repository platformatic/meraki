import { test, expect, beforeEach } from 'vitest'
import { mkdtemp, rm, access } from 'node:fs/promises'
import { mkdirp } from 'mkdirp'
import { tmpdir } from 'node:os'
import { resolve, join } from 'node:path'
import Applications from '../../src/main/lib/applications.mjs'

// Setup meraki app folder (for migrations) and config folder (for the DB)
const platformaticTestDir = await mkdtemp(join(tmpdir(), 'plat-app-test'))
process.env.MERAKI_FOLDER = resolve(join(__dirname, '..', '..'))
process.env.MERAKI_CONFIG_FOLDER = platformaticTestDir
process.env.MERAKI_DB_CONNECTION_STRING = `sqlite://${join(platformaticTestDir, 'meraki.sqlite')}`

beforeEach(async () => {
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

test('get the empty list of applications', async () => {
  const apps = await Applications.create()
  const applications = await apps.getApplications()
  expect(applications).toEqual([])
})

test('add and delete applications', async () => {
  const apps = await Applications.create()
  await apps.addApplication({ name: 'test1', path: '/path/1' })
  await apps.addApplication({ name: 'test2', path: '/path/2' })
  const applications = await apps.getApplications()
  expect(applications).toMatchObject([
    { id: '1', name: 'test1', path: '/path/1' },
    { id: '2', name: 'test2', path: '/path/2' }
  ])

  {
    await apps.deleteApplication('1')
    const applications = await apps.getApplications()
    expect(applications).toMatchObject([
      { id: '2', name: 'test2', path: '/path/2' }
    ])
  }

  {
    await apps.deleteApplication('2')
    const applications = await apps.getApplications()
    expect(applications).toEqual([])
  }
})
