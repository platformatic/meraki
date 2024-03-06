'use strict'
import React, { useState } from 'react'
import PropTypes from 'prop-types'
import typographyStyles from '~/styles/Typography.module.css'
import commonStyles from '~/styles/CommonStyles.module.css'
import styles from './ErrorComponent.module.css'
import Icons from '@platformatic/ui-components/src/components/icons'
import { ANTI_FLASH_WHITE, DULLS_BACKGROUND_COLOR, ERROR_RED, LARGE, SMALL, RICH_BLACK, WHITE, TRANSPARENT, OPACITY_30, MARGIN_0 } from '@platformatic/ui-components/src/components/constants'
import { BorderedBox, Button, HorizontalSeparator } from '@platformatic/ui-components'

function ErrorComponent ({ error, message, onClickDismiss }) {
  const [showLogs, setShowLogs] = useState(false)
  function copyLogs () {

  }

  function reportIssue () {

  }
  return (
    <div className={styles.container}>
      <div className={`${commonStyles.mediumFlexBlock} ${commonStyles.fullWidth} ${commonStyles.itemsCenter}`}>
        <Icons.AlertIcon size={LARGE} color={ERROR_RED} />
        <div className={`${commonStyles.smallFlexBlock} ${commonStyles.fullWidth} ${commonStyles.justifyCenter}`}>
          <p className={`${typographyStyles.desktopBodyLarge} ${typographyStyles.textWhite} ${typographyStyles.textCenter} ${commonStyles.fullWidth}`}>
            Something went wrong!
          </p>
          <p className={`${typographyStyles.desktopBodyLarge} ${typographyStyles.textWhite} ${typographyStyles.opacity70} ${typographyStyles.textCenter} ${commonStyles.fullWidth}`}>
            Please check your logs below.
          </p>
        </div>
        <div className={`${styles.buttonContainer} ${commonStyles.fullWidth}`}>
          <Button
            textClass={typographyStyles.desktopBody}
            label='Dismiss'
            onClick={() => onClickDismiss()}
            color={RICH_BLACK}
            backgroundColor={WHITE}
            paddingClass={`${commonStyles.buttonPadding} cy-action-dismiss`}
            hoverEffect={DULLS_BACKGROUND_COLOR}
            hoverEffectProperties={{ changeBackgroundColor: ANTI_FLASH_WHITE }}
            bordered={false}
          />
          <Button
            label={showLogs ? 'Hide logs' : 'Show Logs'}
            onClick={() => setShowLogs(!showLogs)}
            color={WHITE}
            backgroundColor={RICH_BLACK}
            paddingClass={`${commonStyles.buttonPadding} cy-action-dismiss`}
            textClass={typographyStyles.desktopBody}
            platformaticIconAfter={{ iconName: showLogs ? 'ArrowUpIcon' : 'ArrowDownIcon', size: SMALL, color: WHITE }}

          />
        </div>
      </div>
      {showLogs && (
        <BorderedBox color={WHITE} borderColorOpacity={OPACITY_30} backgroundColor={TRANSPARENT} classes={styles.showedLogsContainer}>
          <div className={`${styles.buttonLogsContainer} ${commonStyles.fullWidth}`}>
            <Button
              label='Copy Logs'
              onClick={() => copyLogs()}
              color={WHITE}
              backgroundColor={RICH_BLACK}
              paddingClass={`${commonStyles.buttonPadding} cy-action-dismiss`}
              textClass={typographyStyles.desktopBody}
              platformaticIcon={{ iconName: 'ArrowUpIcon', size: SMALL, color: WHITE }}
            />
            <Button
              label='Report issue'
              onClick={() => reportIssue()}
              color={WHITE}
              backgroundColor={RICH_BLACK}
              paddingClass={`${commonStyles.buttonPadding} cy-action-dismiss`}
              textClass={typographyStyles.desktopBody}
              platformaticIcon={{ iconName: 'ArrowUpIcon', size: SMALL, color: WHITE }}
            />
          </div>
          <HorizontalSeparator marginTop={MARGIN_0} marginBottom={MARGIN_0} color={WHITE} opacity={OPACITY_30} />
          <div className={`${styles.logContainer} ${typographyStyles.desktopOtherCliTerminalSmall} ${typographyStyles.textWhite}`}>
            {error?.stack?.split('\n').map((s, index) => <p key={index}>{s}</p>)}
          </div>
        </BorderedBox>
      )}
    </div>
  )
}

ErrorComponent.propTypes = {
  /**
   * error
   */
  error: PropTypes.object,
  /**
   * message
   */
  message: PropTypes.string,
  /**
   * onClickDismiss
   */
  onClickDismiss: PropTypes.func
}

ErrorComponent.defaultProps = {
  error: () => {},
  message: '',
  onClickDismiss: () => {}
}

export default ErrorComponent
