'use strict'
import React from 'react'
import PropTypes from 'prop-types'
import typographyStyles from '~/styles/Typography.module.css'
import commonStyles from '~/styles/CommonStyles.module.css'
import styles from './TopContent.module.css'
import { OPACITY_30, WHITE, SMALL, MEDIUM } from '@platformatic/ui-components/src/components/constants'
import { VerticalSeparator, Icons } from '@platformatic/ui-components'

function TopContent ({ totalApps, runningApps, stoppedApps }) {
  return (
    <div className={`${styles.container} ${commonStyles.mediumFlexBlock}`}>
      <div className={`${commonStyles.smallFlexRow} ${commonStyles.fullWidth} ${commonStyles.itemsCenter}`}>
        <Icons.AllAppsIcon color={WHITE} size={MEDIUM} />
        <h2 className={`${typographyStyles.desktopHeadline2} ${typographyStyles.textWhite}`}>All Apps</h2>
      </div>

      <p className={`${typographyStyles.desktopBodyLarge} ${typographyStyles.textWhite} ${typographyStyles.opacity70}`}>
        Manage all your applications. You can create or import existing applications anytime.
      </p>
      <div className={styles.content}>
        <div className={styles.dataContent}>
          <div className={`${commonStyles.tinyFlexRow} ${commonStyles.itemsCenter}`}>
            <Icons.AllAppsIcon color={WHITE} size={SMALL} />
            <span className={`${typographyStyles.desktopBodyLarge} ${typographyStyles.textWhite} ${typographyStyles.opacity70}`}>Total: </span>
            <span className={`${typographyStyles.desktopBodyLarge} ${typographyStyles.textWhite} ${styles.dataContentElement}`} title='00'>{totalApps}</span>
          </div>
          <VerticalSeparator color={WHITE} backgroundColorOpacity={OPACITY_30} classes={styles.verticalSeparator} />
          <div className={`${commonStyles.tinyFlexRow} ${commonStyles.itemsCenter}`}>
            <Icons.RunningAppIcon color={WHITE} size={SMALL} />
            <span className={`${typographyStyles.desktopBodyLarge} ${typographyStyles.textWhite} ${typographyStyles.opacity70}`}>Running: </span>
            <span className={`${typographyStyles.desktopBodyLarge} ${typographyStyles.textWhite} ${styles.dataContentElement}`} title='00'>{runningApps}</span>
          </div>
          <VerticalSeparator color={WHITE} backgroundColorOpacity={OPACITY_30} classes={styles.verticalSeparator} />
          <div className={`${commonStyles.tinyFlexRow} ${commonStyles.itemsCenter}`}>
            <Icons.StoppedAppIcon color={WHITE} size={SMALL} />
            <span className={`${typographyStyles.desktopBodyLarge} ${typographyStyles.textWhite} ${typographyStyles.opacity70}`}>Stopped: </span>
            <span className={`${typographyStyles.desktopBodyLarge} ${typographyStyles.textWhite} ${styles.dataContentElement}`} title='00'>{stoppedApps}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

TopContent.propTypes = {
  /**
   * totalApps
    */
  totalApps: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  /**
   * runningApps
    */
  runningApps: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  /**
   * stoppedApps
    */
  stoppedApps: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ])
}

TopContent.defaultProps = {
  totalApps: '-',
  runningApps: '-',
  stoppedApps: '-'
}

export default TopContent
