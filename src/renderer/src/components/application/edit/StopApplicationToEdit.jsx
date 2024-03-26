'use strict'
import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { MARGIN_0, OPACITY_30, TRANSPARENT, WHITE, DULLS_BACKGROUND_COLOR, RICH_BLACK } from '@platformatic/ui-components/src/components/constants'
import typographyStyles from '~/styles/Typography.module.css'
import commonStyles from '~/styles/CommonStyles.module.css'
import { Button, HorizontalSeparator } from '@platformatic/ui-components'

function StopApplicationToEdit ({ onClickCancel, onClickProceed }) {
  const [stopping, setStopping] = useState(false)

  function handlingClickProceed () {
    setStopping(true)
    onClickProceed()
  }

  return (
    <div className={`${commonStyles.mediumFlexBlock} ${commonStyles.fullWidth}`}>
      <p className={`${typographyStyles.desktopBody} ${typographyStyles.textWhite} ${commonStyles.fullWidth} ${typographyStyles.opacity70}`}>
        To edit this application, it needs to be stopped.<br /><br />If you want to proceed, we stop the application for you.
      </p>
      <HorizontalSeparator marginBottom={MARGIN_0} marginTop={MARGIN_0} color={WHITE} opacity={OPACITY_30} />
      <div className={`${commonStyles.smallFlexRow} ${commonStyles.fullWidth} ${commonStyles.justifyBetween}`}>
        <Button
          type='button'
          label='Cancel'
          onClick={() => onClickCancel()}
          color={WHITE}
          backgroundColor={TRANSPARENT}
          textClass={typographyStyles.desktopBody}
          paddingClass={commonStyles.buttonPadding}
        />
        <Button
          type='button'
          textClass={typographyStyles.desktopBody}
          paddingClass={commonStyles.buttonPadding}
          label={stopping ? 'Stopping...' : 'Proceed'}
          onClick={() => handlingClickProceed()}
          color={RICH_BLACK}
          backgroundColor={WHITE}
          hoverEffect={DULLS_BACKGROUND_COLOR}
          bordered={false}
          disabled={stopping}
        />
      </div>
    </div>
  )
}

StopApplicationToEdit.propTypes = {
  /**
   * onClickCancel
   */
  onClickCancel: PropTypes.func,
  /**
   * onClickProceed
   */
  onClickProceed: PropTypes.func
}

StopApplicationToEdit.defaultProps = {
  onClickCancel: () => {},
  onClickProceed: () => {}
}

export default StopApplicationToEdit
