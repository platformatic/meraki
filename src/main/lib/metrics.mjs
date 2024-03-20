import { RuntimeApiClient } from '@platformatic/control'
import { Writable } from 'node:stream'
import logger from 'electron-log'
// import split from 'split2'

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
  async start (id, callback) {
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
          console.log('writev chunk', c.chunk.toString())
          callback(c.chunk.toString())
        }
        setImmediate(cb)
      }
    })

    // TODO: This is not working, temporary not using `split()`
    // this.#currentStream.pipe(split()).pipe(callbackWritable).on('error', (err) => {
    //   logger.error('Error streaming metrics', err)
    // })

    this.#currentStream.pipe(callbackWritable).on('error', (err) => {
      logger.error('Error streaming metrics', err)
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
