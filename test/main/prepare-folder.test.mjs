import { test, beforeEach, expect } from 'vitest'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { prepareFolder } from '../../src/main/generate.mjs'
import { mkdtemp } from 'node:fs/promises'

const logger = {
  infos: [],
  errors: [],
  info: function (args) {
    logger.infos.push(Array.from(arguments))
  },
  error: function (args) {
    logger.errors.push(Array.from(arguments))
  },
  reset: () => {
    logger.infos = []
    logger.errors = []
  }
}

beforeEach(() => {
  logger.reset()
})

test('Installs no templates or plugins', async () => {
  const appDir = await mkdtemp(join(tmpdir(), 'plat-app-test-create'))
  await prepareFolder(appDir, [], logger, 'test-app')
  expect(logger.errors.length).toBe(0)
})

test('Install in non-existent folder', async () => {
  try {
    await prepareFolder('testnonexitent', [], logger, 'test-app')
    throw new Error('Should have thrown an error')
  } catch (err) {
    expect(err).toBeInstanceOf(Error)
    expect(err.message).toBe('ENOENT: no such file or directory, stat \'testnonexitent\'')
  }
})

test('Install a non-existent template', async () => {
  try {
    const appDir = await mkdtemp(join(tmpdir(), 'plat-app-test-create'))
    await prepareFolder(appDir, ['@platformatic/dontexist'], logger)
    throw new Error('Should have thrown an error')
  } catch (err) {
    expect(err).toBeInstanceOf(Error)
    expect(err.message).toContain('Command failed with exit code 1')
    expect(logger.errors[0]).toEqual(['npm ERR! code E404'])
  }
})

test('Install one @platformatic/service template', async () => {
  const appDir = await mkdtemp(join(tmpdir(), 'plat-app-test-create'))
  await prepareFolder(appDir, ['@platformatic/service'], logger, 'test-app')
  expect(logger.infos[0][0].name).toEqual('@platformatic/service')
  expect(logger.errors.length).toBe(0)
}, 30000)
