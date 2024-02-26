'use strict'
import React from 'react'
import PropTypes from 'prop-types'
import typographyStyles from '~/styles/Typography.module.css'
import commonStyles from '~/styles/CommonStyles.module.css'
import styles from './Welcome.module.css'
import '~/components/component.animation.css'
import { Button, HorizontalSeparator } from '@platformatic/ui-components'
import { ANTI_FLASH_WHITE, DULLS_BACKGROUND_COLOR, MARGIN_0, OPACITY_30, RICH_BLACK, SMALL, WHITE } from '@platformatic/ui-components/src/components/constants'

const Welcome = React.forwardRef(({ onClickImportApp }, ref) => {
  function createNewApp () {

  }

  return (
    <>
      <div className={styles.container} ref={ref}>
        <div className={styles.leftContent}>
          <div className={`${commonStyles.largeFlexBlock40} ${commonStyles.fullWidth}`}>
            <div className={commonStyles.mediumFlexBlock}>
              <h1 className={`${typographyStyles.desktopHeadline1} ${typographyStyles.textWhite}`}>Welcome to Meraki</h1>
              <p className={`${typographyStyles.desktopBodyLarge} ${typographyStyles.textWhite} ${typographyStyles.opacity70}`}>
                Start by creating a new app, or import an existing one.<br />
                Do you need help to start? Read our get <a href='#'>started</a> documentation.
              </p>
            </div>
            <div className={`${styles.buttonContainer} ${commonStyles.fullWidth}`}>
              <Button
                label='Create new App'
                onClick={() => createNewApp()}
                color={RICH_BLACK}
                bordered={false}
                backgroundColor={WHITE}
                hoverEffect={DULLS_BACKGROUND_COLOR}
                hoverEffectProperties={{ changeBackgroundColor: ANTI_FLASH_WHITE }}
                paddingClass={`${commonStyles.buttonPadding} cy-action-create-app`}
                platformaticIcon={{ iconName: 'CreateAppIcon', size: SMALL, color: RICH_BLACK }}
              />
              <Button
                label='Import App'
                onClick={() => onClickImportApp()}
                backgroundColor={RICH_BLACK}
                color={WHITE}
                paddingClass={`${commonStyles.buttonPadding} cy-action-import-app`}
                platformaticIcon={{ iconName: 'ImportAppIcon', size: SMALL, color: WHITE }}
              />
            </div>
            <HorizontalSeparator marginBottom={MARGIN_0} marginTop={MARGIN_0} color={WHITE} opacity={OPACITY_30} />
            <div className={commonStyles.extraSmallFlexBlock}>
              <p className={`${typographyStyles.desktopBodyLargeSemibold} ${typographyStyles.textWhite}`}>Applications running in your System</p>
              <p className={`${typographyStyles.desktopBodyLarge} ${typographyStyles.textWhite} ${typographyStyles.opacity70}`}>You don’t have running application in your system.</p>
            </div>

          </div>
        </div>
        <div className={`${commonStyles.largeFlexBlock} ${commonStyles.halfWidth} ${styles.imageContainer}`}>
          <div className={styles.imageContent} />
        </div>
      </div>
    </>
  )
})

Welcome.propTypes = {
  /**
     * onClickImportApp
     */
  onClickImportApp: PropTypes.func,
  /**
     * onClickCreateNewApp
    */
  onClickCreateNewApp: PropTypes.func
}

Welcome.defaultProps = {
  onClickImportApp: () => {},
  onClickCreateNewApp: () => {}
}

export default Welcome
