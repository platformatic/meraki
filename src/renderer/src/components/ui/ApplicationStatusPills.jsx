'use strict'
import React from 'react'
import PropTypes from 'prop-types'
import typographyStyles from '~/styles/Typography.module.css'
import { MAIN_GREEN, SMALL, WHITE } from '@platformatic/ui-components/src/components/constants'
import { Icons } from '@platformatic/ui-components'
import { STATUS_RUNNING, STATUS_STOPPED } from '~/ui-constants'
import styles from './ApplicationStatusPills.module.css'

function ApplicationStatusPills ({ status }) {
  if (status === STATUS_STOPPED) {
    return (
      <div className={styles.stoppedPills}>
        <Icons.CircleStopIcon color={WHITE} size={SMALL} />
        <span className={`${typographyStyles.desktopOtherOverlineNormal} ${typographyStyles.textWhite}`}>{status}</span>
      </div>
    )
  }
  return (
    <div className={styles.runningPills}>
      <Icons.RunningIcon color={MAIN_GREEN} size={SMALL} />
      <span className={`${typographyStyles.desktopOtherOverlineNormal} ${typographyStyles.textMainGreen}`}>{status}</span>
    </div>
  )
}

ApplicationStatusPills.propTypes = {
  /**
       * status
       */
  status: PropTypes.oneOf([STATUS_RUNNING, STATUS_STOPPED])
}

ApplicationStatusPills.defaultProps = {
  status: STATUS_STOPPED
}

export default ApplicationStatusPills
