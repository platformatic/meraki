'use strict'
import React from 'react'
import PropTypes from 'prop-types'
import commonStyles from '~/styles/CommonStyles.module.css'
import typographyStyles from '~/styles/Typography.module.css'
import { MEDIUM, WHITE } from '@platformatic/ui-components/src/components/constants'
import { Icons, PlatformaticIcon } from '@platformatic/ui-components'
import styles from './EditableTitle.module.css'

function EditableTitle ({ title, iconName, onClickIcon, dataAttrName, dataAttrValue }) {
  const icon = React.createElement(Icons[`${iconName}`], {
    color: WHITE,
    size: MEDIUM
  })

  const dataProps = {}
  if (dataAttrName && dataAttrValue) {
    dataProps[`data-${dataAttrName}`] = dataAttrValue
  }

  return (
    <div className={styles.container}>
      <div className={commonStyles.tinyFlexRow}>
        {icon}
        <h3 className={`${typographyStyles.desktopHeadline3} ${typographyStyles.textWhite}`} {...dataProps}>{title}</h3>
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
