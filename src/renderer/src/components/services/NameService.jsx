'use strict'
import React from 'react'
import PropTypes from 'prop-types'
import { ERROR_RED, SMALL, WHITE } from '@platformatic/ui-components/src/components/constants'
import typographyStyles from '~/styles/Typography.module.css'
import styles from './NameService.module.css'
import commonStyles from '~/styles/CommonStyles.module.css'
import { PlatformaticIcon } from '@platformatic/ui-components'

function NameService ({ name, renameDisabled, onClickEdit, onClickRemove, removeDisabled }) {
  return (
    <div className={`${commonStyles.smallFlexRow} ${commonStyles.justifyBetween} ${commonStyles.itemsCenter} ${commonStyles.fullWidth}`}>
      <div className={`${commonStyles.overflowHidden} ${styles.flexGrow}`}>
        <span className={`${typographyStyles.desktopBodyLargeSemibold} ${typographyStyles.textWhite} ${styles.ellipsis} `} title={name}>
          {name}
        </span>
      </div>
      <div className={`${commonStyles.tinyFlexRow} ${styles.buttonContainer} ${commonStyles.justifyEnd}`}>
        <PlatformaticIcon iconName='EditIcon' color={WHITE} size={SMALL} onClick={() => onClickEdit()} disabled={renameDisabled} internalOverHandling />
        <PlatformaticIcon iconName='TrashIcon' color={ERROR_RED} size={SMALL} onClick={() => onClickRemove()} disabled={removeDisabled} internalOverHandling />
      </div>
    </div>
  )
}

NameService.propTypes = {
  /**
   * name
    */
  name: PropTypes.string,
  /**
   * renameDisabled
    */
  renameDisabled: PropTypes.bool,
  /**
   * onClickEdit
   */
  onClickEdit: PropTypes.func,
  /**
   * onClickRemove
   */
  onClickRemove: PropTypes.func,
  /**
   * removeDisabled
   */
  removeDisabled: PropTypes.bool
}

NameService.defaultProps = {
  onClickEdit: () => {},
  onClickRemove: () => {},
  removeDisabled: true,
  renameDisabled: false
}

export default NameService
