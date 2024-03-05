import { test, expect } from 'vitest'
import { getLatestPlatformaticVersion } from '../../src/main/lib/utils.mjs'

const { MockAgent, setGlobalDispatcher } = require('undici')

const mockAgent = new MockAgent()
setGlobalDispatcher(mockAgent)
mockAgent.disableNetConnect()

test('check latest npm version', async (t) => {
  {
    mockAgent
      .get('https://registry.npmjs.org')
      .intercept({
        method: 'GET',
        path: '/platformatic'
      })
      .reply(200, {
        'dist-tags': {
          latest: '1.2.3'
        }
      })
    const latest = await getLatestPlatformaticVersion('platformatic')
    expect(latest).toBe('1.2.3')
  }
  {
    // returns null
    mockAgent
      .get('https://registry.npmjs.org')
      .intercept({
        method: 'GET',
        path: '/platformatic'
      })
      .reply(404, {})

    const latest = await getLatestPlatformaticVersion('platformatic')
    expect(latest).toBe(null)
  }
})
