import Fastify from 'fastify'
import logger from 'electron-log'
import { tmpdir, platform } from 'node:os'
import { Client, request } from 'undici'
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
    const runtime = this.#applications.getApplication(id)
    if (!pid) throw new Error('Application running PID not found')

    const socketPath = this.#getSocketPath(pid)

    const runtimeUrl = runtime.runtime.url
    const runtimePort = runtimeUrl.split(':').pop()

    const client = new Client({
      hostname: 'localhost',
      protocol: 'http:'
    }, {
      socketPath
    })

    if (!this.#runtimeProxy) {
      this.#runtimeProxy = Fastify()

      this.#runtimeProxy.get('/documentation/json', async (req, reply) => {
        try {
          let spec = null
          if (serviceId) {
            const path = `/api/v1/services/${serviceId}/proxy/documentation/json`
            const res = await client.request({
              path,
              method: 'GET',
              headers: {
                'Content-Type': 'application/json'
              }
            })
            spec = await res.body.json()
            spec.servers = [{ url: `http://localhost:${this.#runtimeProxy.server.address().port}` }]
          } else {
            // in win, if the runtime listens on 0.0.0.0, if localhost is used and resolved
            // to ::1, this wont work, so we need to use 127.0.0.1.
            // TODO: find a better solution
            const res = await request((`http://127.0.0.1:${runtimePort}/documentation/json`), {
              headers: {
                'Content-Type': 'application/json'
              }
            })
            spec = await res.body.json()
            spec.servers = [{ url: `http://localhost:${runtimePort}` }]
          }

          return spec
        } catch (err) {
          logger.error({ err }, 'Error getting documentation')
          throw err
        }
      })

      this.#runtimeProxy.register(proxy, {
        upstream: 'http://localhost',
        rewritePrefix: `/api/v1/services/${serviceId}/proxy`,
        undici: client
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
