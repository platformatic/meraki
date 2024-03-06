import { RuntimeApiClient } from '@platformatic/control'
import { Writable } from 'node:stream'

const BUFFER_TIMEOUT = 1000

// This is a Writable stream that will buffer the logs and calls the callback every 100 lines
// and every BUFFER_TIMEOUT millis
class WriteableBuffer extends Writable {
  constructor (callback) {
    super()
    this.buffer = []
    this.callback = callback
    setInterval(this.#sendBuffer.bind(this), BUFFER_TIMEOUT)
  }

  #sendBuffer () {
    if (this.buffer.length === 0) return
    this.callback(this.buffer)
    this.buffer = []
  }

  #processChunk (chunks) {
    this.buffer = this.buffer.concat(chunks)
    if (this.buffer.length > 100) {
      this.#sendBuffer()
    }
  }

  _write (chunk, encoding, cb) {
    this.#processChunk([chunk.toString()])
    setImmediate(cb)
  }

  _writev (chunks, cb) {
    this.#processChunk(chunks.map((c) => c.chunk.toString()))
    setImmediate(cb)
  }
}

// We assume we stream only one log at a time. This can be exteded
// maintaining a map of streams and pausing/resuming them individually
class Logs {
  #runtimeClient
  #currentStream
  #applications

  constructor (applications) {
    if (!applications) throw new Error('Applications is required')
    this.#runtimeClient = new RuntimeApiClient()
    this.#currentStream = null
    this.#applications = applications
  }

  // callback is a function that will be called with the log lines (as array of strings)
  start (id, callback) {
    if (this.#currentStream) {
      this.#currentStream.destroy()
    }
    const pid = this.#applications.getPid(id)
    if (!pid) throw new Error('Application running PID not found')

    this.#currentStream = this.#runtimeClient.getRuntimeLogsStream(pid)
    this.#currentStream.pipe(new WriteableBuffer(callback))
  }

  pause () {
    if (this.#currentStream) {
      this.#currentStream.pause()
    }
  }

  resume () {
    if (this.#currentStream) {
      this.#currentStream.resume()
    }
  }

  stop () {
    if (this.#currentStream) {
      this.#currentStream.destroy()
      this.#currentStream = null
    }
  }
}

export default Logs
