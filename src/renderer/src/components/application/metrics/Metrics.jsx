'use strict'
import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { MEDIUM, WHITE, OPACITY_30, TRANSPARENT } from '@platformatic/ui-components/src/components/constants'
import styles from './Metrics.module.css'
import typographyStyles from '~/styles/Typography.module.css'
import commonStyles from '~/styles/CommonStyles.module.css'
import { BorderedBox } from '@platformatic/ui-components'
import Icons from '@platformatic/ui-components/src/components/icons'
import useStackablesStore from '~/useStackablesStore'
import { APPLICATION_PAGE_METRICS } from '~/ui-constants'
import LineChart from './LineChart'

const Metrics = React.forwardRef(({ applicationSelected }, ref) => {
  const globalState = useStackablesStore()
  const { setNavigation, setCurrentPage } = globalState

  useEffect(() => {
    if (applicationSelected.id) {
      console.log('here the id', applicationSelected.id)
    }
  }, [applicationSelected.id])

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

  return (
    <div className={styles.container} ref={ref}>
      <div className={styles.content}>
        <div className={`${commonStyles.largeFlexBlock40} ${commonStyles.fullWidth}`}>
          <div className={commonStyles.mediumFlexBlock}>
            <div className={`${commonStyles.mediumFlexRow} ${commonStyles.fullWidth} ${commonStyles.itemsCenter}`}>
              <Icons.MetricsIcon color={WHITE} size={MEDIUM} />
              <h2 className={`${typographyStyles.desktopHeadline2} ${typographyStyles.textWhite}`}>Metrics</h2>
              <p className={`${typographyStyles.desktopBodySmall} ${typographyStyles.textWhite} ${typographyStyles.opacity70}`}>(Last 5 minutes)</p>
            </div>
          </div>

          <div className={`${commonStyles.mediumFlexBlock} ${commonStyles.fullWidth}`}>
            <BorderedBox color={WHITE} borderColorOpacity={OPACITY_30} backgroundColor={TRANSPARENT} classes={styles.boxMetricContainer}>
              <LineChart title='Memory' unit='MB' labels={['RSS', 'Total Heap', 'Heap Used', 'New Space', 'Old Space']} colorSet={0} numberOfLines={5} />
            </BorderedBox>

            <BorderedBox color={WHITE} borderColorOpacity={OPACITY_30} backgroundColor={TRANSPARENT} classes={styles.boxMetricContainer}>
              <LineChart title='CPU Usage & Event loop utilization' unit='%' labels={['CPU usage', 'Event Loop Utilization']} colorSet={1} numberOfLines={2} />
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
