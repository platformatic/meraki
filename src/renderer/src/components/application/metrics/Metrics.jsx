'use strict'
import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { MEDIUM, WHITE, OPACITY_30, TRANSPARENT } from '@platformatic/ui-components/src/components/constants'
import styles from './Metrics.module.css'
import typographyStyles from '~/styles/Typography.module.css'
import commonStyles from '~/styles/CommonStyles.module.css'
import { BorderedBox, LoadingSpinnerV2 } from '@platformatic/ui-components'
import Icons from '@platformatic/ui-components/src/components/icons'
import useStackablesStore from '~/useStackablesStore'
import { APPLICATION_PAGE_METRICS, STATUS_RUNNING } from '~/ui-constants'
import { callApiStartMetrics, getAppMetrics, callApiStopMetrics } from '~/api'
import LineChart from './LineChart'
import StackedBarsChart from './StackedBarsChart'

const Metrics = React.forwardRef(({ applicationSelected }, ref) => {
  const globalState = useStackablesStore()
  const { setNavigation, setCurrentPage } = globalState
  const applicationStatus = globalState.computed.applicationStatus
  const [paused, setPaused] = useState(false) // This pauses the chart flowing (not the data collection)
  const [data, setData] = useState({
    memory: [],
    cpuEL: [],
    latency: []
  })

  useEffect(() => {
    setNavigation({
      label: 'Metrics',
      handleClick: () => {
        setCurrentPage(APPLICATION_PAGE_METRICS)
      },
      key: APPLICATION_PAGE_METRICS,
      page: APPLICATION_PAGE_METRICS
    }, 2)
  }, [])

  const toMB = (bytes) => {
    return Math.round(bytes / 1024 / 1024)
  }

  useEffect(() => {
    if (applicationSelected.id && applicationStatus === STATUS_RUNNING) {
      getAppMetrics(applicationSelected.id, (_, metric) => {
        const parsedMetric = JSON.parse(metric)
        const { date, cpu, elu, rss, totalHeapSize, usedHeapSize, newSpaceSize, oldSpaceSize, entrypoint } = parsedMetric
        const { p50: P50, p90: P90, p95: P95, p99: P99 } = entrypoint.latency
        const time = new Date(date)
        const memory = data.memory
        const cpuEL = data.cpuEL
        const latency = data.latency
        const eluPercentage = elu * 100
        memory.push({
          time,
          values: [rss, totalHeapSize, usedHeapSize, newSpaceSize, oldSpaceSize].map(toMB)
        })
        cpuEL.push({
          time,
          values: [cpu, eluPercentage]
        })
        latency.push({ time, P50, P90, P95, P99 })

        setData({
          memory,
          cpuEL,
          latency
        })
      })
      callApiStartMetrics(applicationSelected.id)
    }
    return callApiStopMetrics
  }, [applicationSelected.id, applicationStatus])

  const { memory, cpuEL, latency } = data

  // We need at least 2 data points to render the charts properly
  if (memory.length < 2 && applicationStatus === STATUS_RUNNING) {
    return (
      <LoadingSpinnerV2
        loading
        applySentences={{
          containerClassName: `${commonStyles.mediumFlexBlock} ${commonStyles.itemsCenter}`,
          sentences: [{
            style: `${typographyStyles.desktopBodyLarge} ${typographyStyles.textWhite}`,
            text: 'Start collecting metrics'
          }]
        }}
        containerClassName={styles.loadingSpinner}
      />
    )
  }

  return (
    <div className={styles.container} ref={ref}>
      <div className={styles.content}>
        <div className={`${commonStyles.largeFlexBlock40} ${commonStyles.fullWidth}`}>
          <div className={commonStyles.mediumFlexBlock}>
            <div className={`${commonStyles.smallFlexRow} ${commonStyles.fullWidth} ${commonStyles.itemsCenter}`}>
              <Icons.MetricsIcon color={WHITE} size={MEDIUM} />
              <h2 className={`${typographyStyles.desktopHeadline2} ${typographyStyles.textWhite}`}>Metrics</h2>
              <p className={`${typographyStyles.desktopBodySmall} ${typographyStyles.textWhite} ${typographyStyles.opacity70}`}>{applicationStatus === STATUS_RUNNING ? '(Last 5 minutes)' : '(The application is stopped. Restart the app to collect new metrics.)'}</p>
              {paused ? <p className={`${typographyStyles.desktopBodySmall}  ${typographyStyles.textWhite} ${typographyStyles.opacity70}`}>Paused, click on a chart to resume</p> : null}
            </div>
          </div>

          <div className={`${commonStyles.mediumFlexBlock} ${commonStyles.fullWidth} ${styles.metricsContainer}`}>
            <BorderedBox color={WHITE} borderColorOpacity={OPACITY_30} backgroundColor={TRANSPARENT} classes={styles.boxMetricContainer}>
              <LineChart
                data={memory}
                title='Memory'
                unit='MB'
                labels={['RSS', 'Total Heap', 'Heap Used', 'New Space', 'Old Space']}
                colorSet={0}
                paused={paused}
                setPaused={setPaused}
              />
            </BorderedBox>

            <BorderedBox color={WHITE} borderColorOpacity={OPACITY_30} backgroundColor={TRANSPARENT} classes={styles.boxMetricContainer}>
              <LineChart
                data={cpuEL}
                title='CPU Usage & Event loop utilization'
                unit='%'
                lowerMaxY={100}
                labels={['CPU usage', 'Event Loop Utilization']}
                colorSet={1}
                paused={paused}
                setPaused={setPaused}
              />
            </BorderedBox>

            <BorderedBox color={WHITE} borderColorOpacity={OPACITY_30} backgroundColor={TRANSPARENT} classes={styles.boxMetricContainer}>
              <StackedBarsChart
                data={latency}
                title='Entrypoint Latency'
                unit='ms'
                paused={paused}
                setPaused={setPaused}
              />
            </BorderedBox>
          </div>
        </div>
      </div>
    </div>
  )
})

Metrics.propTypes = {
  /**
   * applicationSelected
    */
  applicationSelected: PropTypes.object
}

Metrics.defaultProps = {
  applicationSelected: {}
}

export default Metrics
