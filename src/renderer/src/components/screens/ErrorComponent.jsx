'use strict'
import React from 'react'
import PropTypes from 'prop-types'
import typographyStyles from '~/styles/Typography.module.css'
import commonStyles from '~/styles/CommonStyles.module.css'
import styles from './ErrorComponent.module.css'
import Icons from '@platformatic/ui-components/src/components/icons'
import { ERROR_RED, LARGE } from '@platformatic/ui-components/src/components/constants'

function ErrorComponent ({ message }) {
  return (
    <div className={styles.container}>
      <div className={`${commonStyles.mediumFlexBlock} ${commonStyles.fullWidth} ${commonStyles.itemsCenter}`}>
        <Icons.AlertIcon size={LARGE} color={ERROR_RED} />
        <div className={`${commonStyles.smallFlexBlock} ${commonStyles.fullWidth} ${commonStyles.justifyCenter}`}>
          <p className={`${typographyStyles.desktopBodyLarge} ${typographyStyles.textWhite} ${typographyStyles.textCenter} ${commonStyles.fullWidth}`}>
            Something went wrong!
          </p>
          <p className={`${typographyStyles.desktopBodyLarge} ${typographyStyles.textWhite} ${typographyStyles.opacity70} ${typographyStyles.textCenter} ${commonStyles.fullWidth}`}>
            {message}
          </p>
        </div>
      </div>
    </div>
  )
}

ErrorComponent.propTypes = {
  /**
   * message
   */
  message: PropTypes.string
}

ErrorComponent.defaultProps = {
  message: ''
}

export default ErrorComponent
