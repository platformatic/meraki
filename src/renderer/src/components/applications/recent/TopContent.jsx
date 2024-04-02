'use strict'
import React from 'react'
import PropTypes from 'prop-types'
import typographyStyles from '~/styles/Typography.module.css'
import commonStyles from '~/styles/CommonStyles.module.css'
import styles from './TopContent.module.css'
import { OPACITY_30, WHITE, SMALL, MEDIUM } from '@platformatic/ui-components/src/components/constants'
import { VerticalSeparator, Icons } from '@platformatic/ui-components'

function TopContent ({ runningApps, stoppedApps }) {
  return (
    <div className={`${styles.container} ${commonStyles.smallFlexBlock}`}>
      <div className={`${commonStyles.smallFlexRow} ${commonStyles.fullWidth} ${commonStyles.itemsCenter}`}>
        <Icons.RecentAppsIcon color={WHITE} size={MEDIUM} />
        <h3 className={`${typographyStyles.desktopHeadline3} ${typographyStyles.textWhite}`}>Recent Apps</h3>
      </div>
      <p className={`${typographyStyles.desktopBodyLarge} ${typographyStyles.textWhite} ${typographyStyles.opacity70}`}>
        Manage all your applications. You can create or import existing applications anytime.
      </p>
      <div className={styles.content}>
        <div className={styles.dataContent}>
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
  runningApps: '-',
  stoppedApps: '-'
}

export default TopContent
