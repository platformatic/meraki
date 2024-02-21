'use strict'

const test = require('node:test')
const assert = require('node:assert')
const { getServer } = require('../helper')

test('example decorator', async (t) => {
  const server = await getServer(t)

  assert.strictEqual(server.example, 'foobar')
})
