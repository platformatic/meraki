'use strict'
import React from 'react'
import typographyStyles from '~/styles/Typography.module.css'
import commonStyles from '~/styles/CommonStyles.module.css'
import styles from './Welcome.module.css'
import '~/components/component.animation.css'
import { Button, HorizontalSeparator } from '@platformatic/ui-components'
import { ANTI_FLASH_WHITE, DULLS_BACKGROUND_COLOR, MARGIN_0, OPACITY_30, RICH_BLACK, SMALL, TRANSPARENT, WHITE } from '@platformatic/ui-components/src/components/constants'

const Welcome = React.forwardRef((_props, ref) => {
  function createNewApp () {

  }
  
  function importApp () {

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
                onClick={() => importApp()}
                backgroundColor={RICH_BLACK}
                color={WHITE}
                paddingClass={`${commonStyles.buttonPadding} cy-action-import-app`}
                platformaticIcon={{ iconName: 'ImportAppIcon', size: SMALL, color: WHITE }}
              />
            </div>
            <HorizontalSeparator marginBottom={MARGIN_0} marginTop={MARGIN_0} color={WHITE} opacity={OPACITY_30} />
          </div>
        </div>
        <div className={`${commonStyles.largeFlexBlock} ${commonStyles.halfWidth} ${styles.imageContainer}`}>
          <div className={styles.imageContent} />
        </div>
      </div>
    </>
  )
})

export default Welcome
