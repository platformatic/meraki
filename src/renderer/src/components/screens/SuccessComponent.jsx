'use strict'
import React from 'react'
import PropTypes from 'prop-types'
import typographyStyles from '~/styles/Typography.module.css'
import commonStyles from '~/styles/CommonStyles.module.css'
import styles from './SuccessComponent.module.css'
import Icons from '@platformatic/ui-components/src/components/icons'
import { LARGE, MAIN_GREEN } from '@platformatic/ui-components/src/components/constants'

function SuccessComponent ({ title, subtitle }) {
  return (
    <div className={styles.container}>
      <div className={`${commonStyles.mediumFlexBlock} ${commonStyles.fullWidth} ${commonStyles.itemsCenter}`}>
        <Icons.CircleCheckMarkIcon size={LARGE} color={MAIN_GREEN} />
        <div className={`${commonStyles.smallFlexBlock} ${commonStyles.fullWidth} ${commonStyles.justifyCenter}`}>
          <p className={`${typographyStyles.desktopBodyLarge} ${typographyStyles.textWhite} ${typographyStyles.textCenter} ${commonStyles.fullWidth}`}>
            {title}
          </p>
          <p className={`${typographyStyles.desktopBodyLarge} ${typographyStyles.textWhite} ${typographyStyles.opacity70} ${typographyStyles.textCenter} ${commonStyles.fullWidth}`}>
            {subtitle}
          </p>
        </div>
      </div>
    </div>
  )
}

SuccessComponent.propTypes = {
  /**
   * title
   */
  title: PropTypes.string,
  /**
   * subtitle
   */
  subtitle: PropTypes.string
}

SuccessComponent.defaultProps = {
  title: '',
  subtitle: ''
}

export default SuccessComponent
