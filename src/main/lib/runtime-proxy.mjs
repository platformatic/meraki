import Fastify from 'fastify'
import logger from 'electron-log'
import { tmpdir, platform } from 'node:os'
import { Client } from 'undici'
import { join } from 'node:path'
import proxy from '@fastify/http-proxy'

class RuntimeProxy {
  #runtimeProxy
  #applications

  constructor (applications) {
    if (!applications) throw new Error('Applications is required')
    this.#applications = applications
    this.#runtimeProxy = null
  }

  // TODO: This logic is taken from platformatic/control, we should export this from
  // @platformatic/control
  #getSocketPath (pid) {
    const PLATFORMATIC_TMP_DIR = join(tmpdir(), 'platformatic', 'runtimes')
    const PLATFORMATIC_PIPE_PREFIX = '\\\\.\\pipe\\platformatic-'
    if (platform() === 'win32') {
      return PLATFORMATIC_PIPE_PREFIX + pid
    }
    return join(PLATFORMATIC_TMP_DIR, pid.toString(), 'socket')
  }

  async start (id, serviceId) {
    logger.info({ id }, 'Starting proxy')
    const pid = this.#applications.getPid(id)
    if (!pid) throw new Error('Application running PID not found')

    const socketPath = this.#getSocketPath(pid)

    if (!this.#runtimeProxy) {
      this.#runtimeProxy = Fastify({ logger: true, level: 'debug' })

      this.#runtimeProxy.register(proxy, {
        upstream: 'http://localhost',
        rewritePrefix: `/api/v1/services/${serviceId}/proxy`,
        globalAgent: true,
        undici: new Client({
          hostname: 'localhost',
          protocol: 'http:'
        }, {
          socketPath
        })
      })
      await this.#runtimeProxy.listen(0)
    }
    const port = this.#runtimeProxy.server.address().port
    return `http://localhost:${port}`
  }

  async stop () {
    if (this.#runtimeProxy) {
      await this.#runtimeProxy.close()
    }
    this.#runtimeProxy = null
  }
}

export default RuntimeProxy
