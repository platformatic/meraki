'use strict'
import React from 'react'
import PropTypes from 'prop-types'
import { ERROR_RED, MARGIN_0, OPACITY_30, TRANSPARENT, WHITE, DULLS_BACKGROUND_COLOR } from '@platformatic/ui-components/src/components/constants'
import typographyStyles from '~/styles/Typography.module.css'
import commonStyles from '~/styles/CommonStyles.module.css'
import { Button, HorizontalSeparator } from '@platformatic/ui-components'

function DiscardCreate ({ onClickCancel, onClickConfirm }) {
  return (
    <div className={`${commonStyles.mediumFlexBlock} ${commonStyles.fullWidth}`}>
      <p className={`${typographyStyles.desktopBody} ${typographyStyles.textWhite} ${commonStyles.fullWidth} ${typographyStyles.opacity70}`}>
        You are about to leave the creation flow of your app. If you decide to leave all progress will be lost.<br /><br />Are you sure you want to proceed
      </p>
      <HorizontalSeparator marginBottom={MARGIN_0} marginTop={MARGIN_0} color={WHITE} opacity={OPACITY_30} />

      <div className={`${commonStyles.smallFlexRow} ${commonStyles.justifyBetween}`}>
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
          label='Leave'
          onClick={() => onClickConfirm()}
          color={WHITE}
          backgroundColor={ERROR_RED}
          hoverEffect={DULLS_BACKGROUND_COLOR}
          bordered={false}
        />
      </div>
    </div>
  )
}

DiscardCreate.propTypes = {
  /**
   * onClickEdit
   */
  onClickCancel: PropTypes.func,
  /**
   * onClickRemove
   */
  onClickConfirm: PropTypes.func
}

DiscardCreate.defaultProps = {
  onClickCancel: () => {},
  onClickConfirm: () => {}
}

export default DiscardCreate
