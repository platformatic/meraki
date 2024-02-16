import { test, expect } from 'vitest'
import { mkdtemp, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import Runtimes from '../../src/main/runtimes.mjs'
import { setTimeout } from 'timers/promises'

test('should get the runtime unix socket', async () => {
  const tempDir = await mkdtemp(join(tmpdir(), 'platformatic-runtime-test'))
  process.env.PLATFORMATIC_TMP_DIR = tempDir
  process.env.RUNTIME_POLL_INTERVAL = 500

  const runtimes = new Runtimes()
  runtimes.start()

  {
    const sockets = runtimes.sockets
    expect(sockets).toEqual([])
  }

  {
    // unix
    Object.defineProperty(process, 'platform', { value: 'linux' })
    const sockFile = join(tempDir, 'test.sock')
    await writeFile(sockFile, '')
    await setTimeout(1000)
    const sockets = runtimes.sockets
    expect(sockets).toEqual([sockFile])
  }

  {
    // windows
    Object.defineProperty(process, 'platform', { value: 'win32' })
    await setTimeout(1000)
    const sockets = runtimes.sockets
    expect(sockets).toEqual(['\\\\.\\pipe\\' + join(tempDir, 'test.sock')])
  }
})
