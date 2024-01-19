import { test, expect } from 'vitest'
import { getLabelDownloads } from '../../src/renderer/src/utilityDetails'

test('return service on form without plugin', async () => {
  expect('0').toEqual(getLabelDownloads('0'))
  expect('0').toEqual(getLabelDownloads(0))
  expect('0').toEqual(getLabelDownloads(0))
  expect('-').toEqual(getLabelDownloads('-'))
  expect('-').toEqual(getLabelDownloads(null))
  expect('-').toEqual(getLabelDownloads(undefined))
  expect('-').toEqual(getLabelDownloads('aaa'))
  expect('-').toEqual(getLabelDownloads({}))
  expect('-').toEqual(getLabelDownloads({ asas: 1 }))
  expect('-').toEqual(getLabelDownloads([1, 2, 3]))
  const params = ['99', '100', '504', '999', '1000', '1111', '9999', '50000', '233002', '999999', '1000000', '1234000', '32323122']
  const expected = ['99', '100', '504', '999', '1k', '1k', '9k', '50k', '233k', '999k', '1M', '1M', '32M']
  for (let i = 0; i < params.length; i++) {
    expect(expected[i]).toEqual(getLabelDownloads(params[i]))
  }
})
