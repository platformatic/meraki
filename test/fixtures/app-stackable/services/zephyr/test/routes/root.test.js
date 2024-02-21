'use strict'

const test = require('node:test')
const assert = require('node:assert')
const { getServer } = require('../helper')

test('example', async (t) => {
  const server = await getServer(t)
  const res = await server.inject({
    method: 'GET',
    url: '/example'
  })

  assert.strictEqual(res.statusCode, 200)
  assert.deepStrictEqual(res.json(), {
    hello: 'foobar'
  })
})
