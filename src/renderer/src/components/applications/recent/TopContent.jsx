'use strict'
import React from 'react'
import PropTypes from 'prop-types'
import typographyStyles from '~/styles/Typography.module.css'
import commonStyles from '~/styles/CommonStyles.module.css'
import styles from './TopContent.module.css'
import { OPACITY_30, WHITE, SMALL } from '@platformatic/ui-components/src/components/constants'
import { VerticalSeparator, Icons } from '@platformatic/ui-components'

function TopContent ({ runningApps, stoppedApps }) {
  return (
    <div className={`${styles.container} ${commonStyles.mediumFlexBlock}`}>
      <h2 className={`${typographyStyles.desktopHeadline2} ${typographyStyles.textWhite}`}>
        Recent Apps
      </h2>
      <p className={`${typographyStyles.desktopBodyLarge} ${typographyStyles.textWhite} ${typographyStyles.opacity70}`}>
        Manage all your applications. You can create or import existing applications anytime.
      </p>
      <div className={styles.content}>
        <div className={styles.dataContent}>
          <div className={`${commonStyles.smallFlexRow} ${commonStyles.itemsCenter}`}>
            <Icons.CreatingAppIcon color={WHITE} size={SMALL} />
            <span className={`${typographyStyles.desktopBodyLarge} ${typographyStyles.textWhite} ${typographyStyles.opacity70}`}>Running: </span>
            <span className={`${typographyStyles.desktopBodyLarge} ${typographyStyles.textWhite}`}>{runningApps}</span>
          </div>
          <VerticalSeparator color={WHITE} backgroundColorOpacity={OPACITY_30} classes={styles.verticalSeparator} />
          <div className={`${commonStyles.smallFlexRow} ${commonStyles.itemsCenter}`}>
            <Icons.StoppedAppIcon color={WHITE} size={SMALL} />
            <span className={`${typographyStyles.desktopBodyLarge} ${typographyStyles.textWhite} ${typographyStyles.opacity70}`}>Stopped: </span>
            <span className={`${typographyStyles.desktopBodyLarge} ${typographyStyles.textWhite}`}>{stoppedApps}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

TopContent.propTypes = {
  /**
   * runningApps
    */
  runningApps: PropTypes.string,
  /**
   * stoppedApps
    */
  stoppedApps: PropTypes.string
}

TopContent.defaultProps = {
  runningApps: '-',
  stoppedApps: '-'
}

export default TopContent
