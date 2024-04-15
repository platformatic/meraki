import { test, expect, beforeAll, onTestFinished } from 'vitest'
import { tmpdir } from 'node:os'
import { mkdtemp, cp, rm, access, readFile } from 'node:fs/promises'
import { resolve, join } from 'node:path'
import { mkdirp } from 'mkdirp'
import Applications from '../../src/main/lib/applications.mjs'
import { upgradePlt } from '../../src/main/lib/upgrade-plt.mjs'
import { cleanNpmVersion } from '../../src/main/lib/utils.mjs'
import execa from 'execa'

// Setup meraki app folder (for migrations) and config folder (for the DB)
const platformaticTestDir = await mkdtemp(join(tmpdir(), 'plat-app-test'))
process.env.MERAKI_FOLDER = resolve(join(__dirname, '..', '..'))
process.env.MERAKI_CONFIG_FOLDER = platformaticTestDir
process.env.MERAKI_DB_CONNECTION_STRING = `sqlite://${join(platformaticTestDir, 'meraki.sqlite')}`

beforeAll(async () => {
  // we clean up the DB
  try {
    await access(platformaticTestDir)
    await rm(platformaticTestDir, { recursive: true })
    await mkdirp(platformaticTestDir)
  } catch (err) {}
})

test('upgrade a platformatic runtime', async (t) => {
  const appDir = await mkdtemp(join(tmpdir(), 'plat-app-test'))
  onTestFinished(() => rm(appDir, { recursive: true }))
  const appFixture = join('test', 'fixtures', 'old')
  await cp(appFixture, appDir, { recursive: true })

  const { stdout: version } = await execa('npm', ['view', 'platformatic', 'version'], { cwd: appDir })

  const applicationsApi = await Applications.create()

  await applicationsApi.importApplication(appDir)

  await upgradePlt({ cwd: appDir }, console)

  const rootPackageJson = JSON.parse(await readFile(join(appDir, 'package.json'), 'utf-8'))
  expect(cleanNpmVersion(rootPackageJson.dependencies.platformatic)).toBe(version)

  const servicesFolder = join(appDir, 'services')
  const service1PackageJson = require(join(servicesFolder, 'service-1', 'package.json'))
  expect(cleanNpmVersion(service1PackageJson.dependencies['@platformatic/runtime'])).toBe(version)
  const service2PackageJson = require(join(servicesFolder, 'service-2', 'package.json'))
  expect(cleanNpmVersion(service2PackageJson.dependencies['@platformatic/runtime'])).toBe(version)
}, 90000)
