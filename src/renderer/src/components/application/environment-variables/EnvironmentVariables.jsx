'use strict'
import React from 'react'
import PropTypes from 'prop-types'
import { WHITE, MARGIN_0, OPACITY_30, MEDIUM } from '@platformatic/ui-components/src/components/constants'
import styles from './EnvironmentVariables.module.css'
import typographyStyles from '~/styles/Typography.module.css'
import commonStyles from '~/styles/CommonStyles.module.css'
import { HorizontalSeparator } from '@platformatic/ui-components'
import Icons from '@platformatic/ui-components/src/components/icons'
import DisplayEnvironmentVariables from './DisplayEnvironmentVariables'
import { generateForm } from '~/utils'

const EnvironmentVariables = React.forwardRef(({ services }, ref) => {
  return (
    <div className={styles.container} ref={ref}>
      <div className={styles.content}>
        <div className={`${commonStyles.largeFlexBlock} ${commonStyles.fullWidth}`}>
          <div className={commonStyles.mediumFlexBlock}>
            <div className={`${commonStyles.mediumFlexRow} ${commonStyles.fullWidth}`}>
              <Icons.AppConfigurationIcon color={WHITE} size={MEDIUM} />
              <h2 className={`${typographyStyles.desktopHeadline2} ${typographyStyles.textWhite}`}>Environment Variables</h2>
            </div>
            <p className={`${typographyStyles.desktopBody} ${typographyStyles.textWhite} ${typographyStyles.opacity70}`}>These are the environment variables of your application. You can edit anytime by clicking on “Edit application” in your Application overview.</p>
          </div>
          <HorizontalSeparator marginBottom={MARGIN_0} marginTop={MARGIN_0} color={WHITE} opacity={OPACITY_30} />
          <div className={`${commonStyles.mediumFlexBlock} ${commonStyles.fullWidth} ${styles.content}`}>
            <DisplayEnvironmentVariables configuredServices={generateForm(services)} />
          </div>
        </div>
      </div>
    </div>
  )
})

EnvironmentVariables.propTypes = {
  /**
   * services
    */
  services: PropTypes.array
}

EnvironmentVariables.defaultProps = {
  services: []
}

export default EnvironmentVariables
