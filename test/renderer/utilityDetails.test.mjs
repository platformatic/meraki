import { test, expect } from 'vitest'
import { getLabelDownloads, getLabelReleasedAt } from '../../src/renderer/src/utilityDetails'

test('return label donwloads', async () => {
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

test('return label released At', async () => {
  const today = new Date()
  const oneDay = 1000 * 60 * 60 * 24
  const result = Math.round((today.getTime() / oneDay))
  const numberOfDaysSinceEpoch = result.toFixed(0)
  const numberOfYearsSinceEpoch = (numberOfDaysSinceEpoch / 365).toFixed(0)

  expect(`${numberOfYearsSinceEpoch} years ago`).toEqual(getLabelReleasedAt('0'))
  expect(`${numberOfYearsSinceEpoch} years ago`).toEqual(getLabelReleasedAt(0))
  expect(`${numberOfYearsSinceEpoch} years ago`).toEqual(getLabelReleasedAt(0))
  expect('-').toEqual(getLabelReleasedAt('-'))
  expect('-').toEqual(getLabelReleasedAt(null))
  expect('-').toEqual(getLabelReleasedAt(undefined))
  expect('-').toEqual(getLabelReleasedAt('aaa'))
  expect('-').toEqual(getLabelReleasedAt({}))
  expect('-').toEqual(getLabelReleasedAt({ asas: 1 }))
  expect('-').toEqual(getLabelReleasedAt([1, 2, 3]))
  // yesterday
  const date = new Date()
  date.setDate(date.getDate() - 1)
  expect('-').toEqual(getLabelReleasedAt(date))
  expect('1 day ago').toEqual(getLabelReleasedAt(date.getTime()))

  date.setDate(date.getDate() - 3)
  expect('4 days ago').toEqual(getLabelReleasedAt(date.getTime()))

  date.setDate(date.getDate() - 2)
  expect('2 weeks ago').toEqual(getLabelReleasedAt(date.getTime()))

  date.setDate(date.getDate() - 14)
  expect('1 month ago').toEqual(getLabelReleasedAt(date.getTime()))

  date.setDate(date.getDate() - 36)
  expect('2 months ago').toEqual(getLabelReleasedAt(date.getTime()))

  date.setDate(date.getDate() - 365)
  expect('1 year ago').toEqual(getLabelReleasedAt(date.getTime()))

  date.setDate(date.getDate() - 777)
  expect('3 years ago').toEqual(getLabelReleasedAt(date.getTime()))
})
