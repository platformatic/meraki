import { test, expect } from 'vitest'
import { mkdtemp } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { resolve, join } from 'node:path'
import Applications from '../../src/main/lib/applications.mjs'
import { rimraf } from 'rimraf'

const migrationsPath = resolve(join(__dirname, '..', '..'))

test('get the empty list of applications', async () => {
  const platformaticDir = await mkdtemp(join(tmpdir(), 'plat-app-test'))
  process.env.MERAKI_DB_CONNECTION_STRING = `sqlite://${join(platformaticDir, 'meraki.sqlite')}`

  const apps = await Applications.getApplications(migrationsPath, platformaticDir)
  const applications = await apps.getApplications()

  expect(applications).toEqual([])
  await rimraf(platformaticDir)
})

test('add and delete applications', async () => {
  const platformaticDir = await mkdtemp(join(tmpdir(), 'plat-app-test'))
  process.env.MERAKI_DB_CONNECTION_STRING = `sqlite://${join(platformaticDir, 'meraki.sqlite')}`

  const apps = await Applications.getApplications(migrationsPath, platformaticDir)
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

  await rimraf(platformaticDir)
})
