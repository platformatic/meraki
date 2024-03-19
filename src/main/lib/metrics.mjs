import { RuntimeApiClient } from '@platformatic/control'
import { Readable } from 'node:stream'
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

  // callback is a function that will be called with the metrics
  start (id, callback) {
    if (this.#currentStream) {
      this.#currentStream.destroy()
    }

    // TODO: get the metrics stream. For the time being we just generate random values
    // TODO: uncomment to test with the real stream
    // const pid = this.#applications.getPid(id)
    // if (!pid) throw new Error('Application running PID not found')
    // this.#currentStream = this.#runtimeClient.getRuntimeLiveLogsStream(pid)

    // TODO: remove this block when the real stream is available
    async function * metricGenerator () {
      while (true) {
        const p50 = Math.round(Math.random() * 100, 0)
        const p90 = p50 + Math.round(Math.random() * 100, 0)
        const p95 = p90 + Math.round(Math.random() * 100, 0)
        const p99 = p95 + Math.round(Math.random() * 100, 0)

        const metric = {
          version: 1,
          date: new Date().toISOString(),
          cpu: Math.round(Math.random() * 100),
          elu: Math.round(Math.random() * 100) / 100,
          rss: Math.round(Math.random() * 100000000),
          totalHeapSize: Math.round(Math.random() * 100000000),
          usedHeapSize: Math.round(Math.random() * 100000000),
          newSpaceSize: Math.round(Math.random() * 100000000),
          oldSpaceSize: Math.round(Math.random() * 100000000),
          entrypoint: {
            latency: {
              p50,
              p90,
              p95,
              p99
            }
          }
        }
        await new Promise((resolve) => setTimeout(resolve, 1000))
        yield JSON.stringify(metric).concat('\n')
      }
    }
    this.#currentStream = Readable.from(metricGenerator())

    // We don't buffer because we expect one metric per second, and we want to process them as soon as they arrive
    this.#currentStream.pipe(split(callback))
  }

  stop () {
    if (this.#currentStream) {
      this.#currentStream.destroy()
      this.#currentStream = null
    }
  }
}

export default Metrics
