'use strict'
import React from 'react'
import PropTypes from 'prop-types'
import { RICH_BLACK, WHITE, MARGIN_0, OPACITY_30, TRANSPARENT, DULLS_BACKGROUND_COLOR, ANTI_FLASH_WHITE } from '@platformatic/ui-components/src/components/constants'
import styles from './Overview.module.css'
import typographyStyles from '~/styles/Typography.module.css'
import commonStyles from '~/styles/CommonStyles.module.css'
import { Button, HorizontalSeparator, VerticalSeparator } from '@platformatic/ui-components'
import { getFormattedDate } from '../../../utilityDetails'
import Title from '~/components/ui/Title'

const Overview = React.forwardRef((_props, ref) => {
  const applicationSelected = {
    id: '1',
    name: 'Ransom',
    status: 'running',
    platformaticVersion: '1.0.0',
    updateVersion: true,
    lastStarted: '1708887874046',
    lastUpdate: '1708887874046',
    insideMeraki: true
  }

  function onStop () {

  }

  function onRestart () {

  }

  return (
    <div className={styles.container} ref={ref}>
      <div className={styles.content}>
        <div className={`${commonStyles.largeFlexBlock} ${commonStyles.fullWidth}`}>
          <div className={commonStyles.mediumFlexBlock}>
            <Title
              title={applicationSelected.name}
              iconName='StackablesTemplateIcon'
              dataAttrName='cy'
              dataAttrValue='modal-title'
            />
            <div className={`${commonStyles.mediumFlexRow} ${commonStyles.fullWidth} ${commonStyles.itemsCenter} `}>
              <div className={`${commonStyles.smallFlexRow} ${commonStyles.itemsCenter}`}>
                <span className={`${typographyStyles.desktopBodyLarge} ${typographyStyles.textWhite} ${typographyStyles.opacity70}`}>Last Update</span>
                <span className={`${typographyStyles.desktopBodyLarge} ${typographyStyles.textWhite}`}>{getFormattedDate(applicationSelected.lastUpdate)}</span>
              </div>

              <VerticalSeparator color={WHITE} backgroundColorOpacity={OPACITY_30} />

              <div className={`${commonStyles.smallFlexRow} ${commonStyles.itemsCenter}`}>
                <span className={`${typographyStyles.desktopBodyLarge} ${typographyStyles.textWhite} ${typographyStyles.opacity70}`}>Last Started</span>
                <span className={`${typographyStyles.desktopBodyLarge} ${typographyStyles.textWhite}`}>{getFormattedDate(applicationSelected.lastStarted)}</span>
              </div>

              <VerticalSeparator color={WHITE} backgroundColorOpacity={OPACITY_30} />
            </div>

            <div className={`${styles.buttonContainer} ${commonStyles.fullWidth}`}>
              <Button
                type='button'
                label='Stop'
                onClick={() => onStop()}
                color={WHITE}
                backgroundColor={TRANSPARENT}
                paddingClass={commonStyles.buttonPadding}
                platformaticIcon={{ iconName: 'CircleStopIcon', color: RICH_BLACK }}
                textClass={typographyStyles.desktopBody}
              />
              <Button
                type='button'
                label='Generate App'
                onClick={() => onRestart()}
                color={RICH_BLACK}
                bordered={false}
                backgroundColor={WHITE}
                hoverEffect={DULLS_BACKGROUND_COLOR}
                hoverEffectProperties={{ changeBackgroundColor: ANTI_FLASH_WHITE }}
                paddingClass={commonStyles.buttonPadding}
                platformaticIcon={{ iconName: 'RestartIcon', color: WHITE }}
                textClass={typographyStyles.desktopBody}
              />
            </div>
          </div>

          <HorizontalSeparator marginBottom={MARGIN_0} marginTop={MARGIN_0} color={WHITE} opacity={OPACITY_30} />

        </div>
      </div>
    </div>
  )
})

Overview.propTypes = {
  /**
   * name
    */
  name: PropTypes.string,
  /**
   * onClickEdit
   */
  onCloseModal: PropTypes.func,
  /**
   * onClickRemove
   */
  onClickConfirm: PropTypes.func
}

Overview.defaultProps = {
  onCloseModal: () => {},
  onClickConfirm: () => {}
}

export default Overview
