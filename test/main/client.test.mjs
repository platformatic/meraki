import { test, expect, onTestFinished } from 'vitest'
import { startMarketplace, setUpEnvironment } from './helper.mjs'
import { mkdtemp, writeFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { mkdirp } from 'mkdirp'

setUpEnvironment()
const { getTemplates, getPlugins } = await import('../../src/main/client.mjs')

test('should invoke marketplace for stackables', async () => {
  const platformaticDir = await mkdtemp(join(tmpdir(), 'plat-app-test-home'))
  onTestFinished(() => rm(platformaticDir, { recursive: true }))
  process.env.HOME = platformaticDir
  await mkdirp(join(platformaticDir, '.platformatic'))
  const stacks = [
    {
      orgName: 'org1',
      name: 'stackable1',
      description: 'stackable1 description',
      public: true
    },
    {
      orgName: 'org2',
      name: 'stackable2',
      description: 'stackable2 description',
      public: true
    }
  ]
  await startMarketplace({
    getStackablesCallback: (request, reply) => {
      reply.code(200).send(stacks)
    }
  })
  const stackables = await getTemplates()
  expect(stackables).toEqual(stacks)
})

test('should invoke marketplace for stackables', async () => {
  const platformaticDir = await mkdtemp(join(tmpdir(), 'plat-app-test-home'))
  onTestFinished(() => rm(platformaticDir, { recursive: true }))
  process.env.HOME = platformaticDir
  await mkdirp(join(platformaticDir, '.platformatic'))
  const configPath = join(platformaticDir, '.platformatic', 'config.json')
  const config = {
    $schema: 'https://platformatic.dev/schemas/v1.12.1/login'
  }
  await writeFile(configPath, JSON.stringify(config), 'utf8')

  const stacks = [
    {
      orgName: 'org1',
      name: 'stackable1',
      description: 'stackable1 description',
      public: true
    },
    {
      orgName: 'org2',
      name: 'stackable2',
      description: 'stackable2 description',
      public: true
    }
  ]
  await startMarketplace({
    getStackablesCallback: (request, reply) => {
      reply.code(200).send(stacks)
    }
  })
  const stackables = await getTemplates()
  expect(stackables).toEqual(stacks)
})

test('should invoke marketplace for stackables', async () => {
  const envVars1 = [{
    name: 'TEST',
    path: '/test',
    type: 'string'
  }, {
    name: 'TEST2',
    path: '/test2',
    type: 'number'
  }]

  const plugs = [
    {
      name: 'plugin1',
      description: 'plugin1 description',
      envVars: envVars1
    },
    {
      name: 'plugin2',
      description: 'plugin2 description',
      envVars: []
    }
  ]
  await startMarketplace({
    getPluginsCallback: (request, reply) => {
      reply.code(200).send(plugs)
    }
  })
  const plugins = await getPlugins()
  expect(plugins).toEqual(plugs)
})
