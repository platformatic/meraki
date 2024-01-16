'use strict'
import React from 'react'
import PropTypes from 'prop-types'
import { ERROR_RED, MARGIN_0, OPACITY_30, TRANSPARENT, WHITE } from '@platformatic/ui-components/src/components/constants'
import typographyStyles from '~/styles/Typography.module.css'
import commonStyles from '~/styles/CommonStyles.module.css'
import { Button, HorizontalSeparator } from '@platformatic/ui-components'

function RemoveService ({ name, onClickCancel, onClickConfirm }) {
  return (
    <div className={`${commonStyles.mediumFlexBlock} ${commonStyles.fullWidth}`}>
      <p className={`${typographyStyles.desktopBody} ${typographyStyles.textWhite} ${commonStyles.fullWidth}`}>
        <span className={`${typographyStyles.opacity70}`}>You are about to delete </span>{name}
      </p>
      <HorizontalSeparator marginBottom={MARGIN_0} marginTop={MARGIN_0} color={WHITE} opacity={OPACITY_30} />
      <div className={`${commonStyles.mediumFlexRow} ${commonStyles.justifyBetween}`}>
        <Button
          type='button'
          paddingClass={commonStyles.buttonPadding}
          label='Cancel'
          onClick={() => onClickCancel()}
          color={WHITE}
          backgroundColor={TRANSPARENT}
        />
        <Button
          type='button'
          paddingClass={commonStyles.buttonPadding}
          label='Delete Service'
          onClick={() => onClickConfirm()}
          color={ERROR_RED}
          backgroundColor={TRANSPARENT}
        />
      </div>
    </div>
  )
}

RemoveService.propTypes = {
  /**
   * name
    */
  name: PropTypes.string.isRequired,
  /**
   * onClickEdit
   */
  onClickCancel: PropTypes.func,
  /**
   * onClickRemove
   */
  onClickConfirm: PropTypes.func
}

RemoveService.defaultProps = {
  onClickCancel: () => {},
  onClickConfirm: () => {}
}

export default RemoveService
