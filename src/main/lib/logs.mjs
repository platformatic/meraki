import { RuntimeApiClient } from '@platformatic/control'
import { Writable, Readable, pipeline } from 'node:stream'
import Fastify from 'fastify'
import split from 'split2'
import logger from 'electron-log'

const BUFFER_TIMEOUT = 1000
const MAX_LOGS_BUFFERED = 10000

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
    if (this.buffer.length > MAX_LOGS_BUFFERED) {
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
// maintaining a map of streams (and log indexes) and pausing/resuming them individually
class Logs {
  #runtimeClient
  #currentLiveStream
  #applications
  #logServer
  #logIndexes
  #currentLogIndex

  constructor (applications) {
    if (!applications) throw new Error('Applications is required')
    this.#resetLog()
    this.#runtimeClient = new RuntimeApiClient()
    this.#applications = applications
  }

  #resetLog () {
    if (this.#currentLiveStream) {
      this.#currentLiveStream.destroy()
      this.#currentLiveStream = null
    }
    this.#logServer = null
    this.#logIndexes = []
    this.#currentLogIndex = 0
  }

  // Start the live streaming of logs for the given application
  // callback is a function that will be called with the log lines (as array of strings)
  async start (id, callback) {
    this.#resetLog()
    const pid = this.#applications.getPid(id)
    if (!pid) throw new Error('Application running PID not found')

    this.#logIndexes = await this.#runtimeClient.getRuntimeLogIndexes(pid)
    this.#currentLogIndex = this.#logIndexes.length - 1
    this.#currentLiveStream = this.#runtimeClient.getRuntimeLiveLogsStream(pid, this.#logIndexes[this.#currentLogIndex])

    pipeline(this.#currentLiveStream, split(), new WriteableBuffer(callback), (err) => {
      if (err) {
        if (err.code === 'ERR_STREAM_PREMATURE_CLOSE') {
          logger.info(`logs stream closed for application ${id}`)
        } else {
          logger.error('Error streaming logs', err)
        }
      }
    })
  }

  pause () {
    if (this.#currentLiveStream) {
      this.#currentLiveStream.pause()
    }
  }

  resume () {
    if (this.#currentLiveStream) {
      this.#currentLiveStream.resume()
    }
  }

  stop () {
    this.#resetLog()
  }

  // This creates a new server that will stream all the logs for the given application
  // and returns the URL to access it. We need this to use electron-dl (which uses the electron native APIs)
  // to download the logs
  async getAllLogsURL (id) {
    if (!this.#logServer) {
      this.#logServer = Fastify()
      this.#logServer.get('/logs/:id', async (req, reply) => {
        const pid = this.#applications.getPid(id)
        if (!pid) throw new Error('Application running PID not found')
        const fullLogStream = await this.#runtimeClient.getRuntimeAllLogsStream(pid)
        return reply.send(fullLogStream)
      })
      await this.#logServer.listen(0) // TODO: We should use a unix socket for that
    }
    const port = this.#logServer.server.address().port
    return `http://127.0.0.1:${port}/logs/${id}`
  }

  async closeLogServer () {
    if (this.#logServer) {
      await this.#logServer.close()
    }
    this.#resetLog()
  }

  async getPreviousLogs (id) {
    if (this.#currentLogIndex <= 0) return []
    const pid = this.#applications.getPid(id)
    if (!pid) throw new Error('Application running PID not found')
    const index = this.#logIndexes[this.#currentLogIndex - 1]

    const logs = []
    try {
      const logStream = await this.#runtimeClient.getRuntimeLogsStream(pid, index)
      for await (const chunk of logStream.pipe(split())) {
        logs.push(chunk)
      }
      this.#currentLogIndex -= 1
      return logs
    } catch (err) {
      if (err.statusCode === 404) {
        // This is a log file that has been deleted
        return []
      }
      logger.error(`Error getting log stream with index ${index}`, err)
      throw err
    }
  }
}

export default Logs
