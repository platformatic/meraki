import { RuntimeApiClient } from '@platformatic/control'
import { Writable, pipeline } from 'node:stream'
import logger from 'electron-log'
import split from 'split2'

// We assume we manage only one stream at a given  time. This can be exteded maintaining a map of streams
class Metrics {
  #runtimeClient
  #currentStream
  #applications

  constructor (applications) {
    if (!applications) throw new Error('Applications is required')
    this.#runtimeClient = new RuntimeApiClient()
    this.#currentStream = null
    this.#applications = applications
  }

  // callback is a function that will be called with the single metrics line
  start (id, callback) {
    if (this.#currentStream) {
      this.#currentStream.destroy()
    }

    const pid = this.#applications.getPid(id)
    if (!pid) throw new Error('Application running PID not found')
    this.#currentStream = this.#runtimeClient.getRuntimeLiveMetricsStream(pid)

    const callbackWritable = new Writable({
      write (chunk, encoding, cb) {
        callback(chunk.toString())
        setImmediate(cb)
      },

      writev (chunks, cb) {
        for (const c of chunks) {
          callback(c.chunk.toString())
        }
        setImmediate(cb)
      }
    })

    pipeline(this.#currentStream, split(), callbackWritable, (err) => {
      if (err) {
        if (err.code === 'ERR_STREAM_PREMATURE_CLOSE') {
          logger.info(`metrics stream closed for application ${id}`)
        } else {
          logger.error('Error streaming metrics', err)
        }
      }
    })
  }

  stop () {
    if (this.#currentStream) {
      this.#currentStream.destroy()
      this.#currentStream = null
    }
  }
}

export default Metrics
