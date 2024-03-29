'use strict'
import React from 'react'
import PropTypes from 'prop-types'
import commonStyles from '~/styles/CommonStyles.module.css'
import typographyStyles from '~/styles/Typography.module.css'
import { LARGE, MEDIUM, WHITE } from '@platformatic/ui-components/src/components/constants'
import { Icons, PlatformaticIcon } from '@platformatic/ui-components'
import styles from './EditableTitle.module.css'

function EditableTitle ({ title, iconName, onClickIcon, dataAttrName, dataAttrValue }) {
  const icon = React.createElement(Icons[`${iconName}`], {
    color: WHITE,
    size: LARGE
  })

  const dataProps = {}
  if (dataAttrName && dataAttrValue) {
    dataProps[`data-${dataAttrName}`] = dataAttrValue
  }

  return (
    <div className={styles.container}>
      <div className={commonStyles.smallFlexRow}>
        {icon}
        <h2 className={`${typographyStyles.desktopHeadline2} ${typographyStyles.textWhite}`} {...dataProps}>{title}</h2>
        <PlatformaticIcon iconName='EditIcon' color={WHITE} size={MEDIUM} onClick={() => onClickIcon()} internalOverHandling />
      </div>
    </div>
  )
}

EditableTitle.propTypes = {
  /**
     * title
     */
  title: PropTypes.string.isRequired,
  /**
     * iconName
     */
  iconName: PropTypes.string.isRequired,
  /**
     * onClickIcon
     */
  onClickIcon: PropTypes.func,
  /**
   * dataAttrName
  */
  dataAttrName: PropTypes.string,
  /**
   * dataAttrValue
  */
  dataAttrValue: PropTypes.string
}

EditableTitle.defaultProps = {
  onClickIcon: () => {},
  dataAttrName: '',
  dataAttrValue: ''
}

export default EditableTitle
