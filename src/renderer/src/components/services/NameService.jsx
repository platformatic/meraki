'use strict'
import React from 'react'
import PropTypes from 'prop-types'
import { MEDIUM, WHITE } from '@platformatic/ui-components/src/components/constants'
import typographyStyles from '~/styles/Typography.module.css'
import styles from './NameService.module.css'
import commonStyles from '~/styles/CommonStyles.module.css'
import { PlatformaticIcon } from '@platformatic/ui-components'

function NameService ({ name, onClickEdit, onClickRemove, removeDisabled }) {
  return (
    <div className={`${commonStyles.mediumFlexRow} ${commonStyles.justifyBetween} ${commonStyles.itemsCenter} ${commonStyles.fullWidth}`}>
      <div className={`${commonStyles.overflowHidden} ${styles.flexGrow}`}>
        <h5 className={`${typographyStyles.desktopHeadline4} ${typographyStyles.textWhite} ${styles.ellipsis} `} title={name}>
          {name}
        </h5>
      </div>
      <div className={`${commonStyles.mediumFlexRow} ${styles.buttonContainer} ${commonStyles.justifyEnd}`}>
        <PlatformaticIcon iconName='EditIcon' color={WHITE} size={MEDIUM} onClick={() => onClickEdit()} />
        <PlatformaticIcon iconName='TrashIcon' color={WHITE} size={MEDIUM} onClick={() => onClickRemove()} disabled={removeDisabled} />
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
  removeDisabled: true
}

export default NameService
