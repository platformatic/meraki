import { RuntimeApiClient } from '@platformatic/control'

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

  start (id, send) {
    if (this.#currentStream) {
      this.#currentStream.destroy()
    }
    const pid = this.#applications.getPid(id)
    if (!pid) throw new Error('Application running PID not found')
    this.#currentStream = this.#runtimeClient.getRuntimeLogsStream(pid)
    this.#currentStream.on('data', (data) => {
      const logs = data.toString().split('\n')
      for (const log of logs) {
        if (log !== '') {
          send(log)
        }
      }
    })
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
