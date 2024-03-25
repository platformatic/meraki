'use strict'
import React from 'react'
import PropTypes from 'prop-types'
import typographyStyles from '~/styles/Typography.module.css'
import commonStyles from '~/styles/CommonStyles.module.css'
import { LARGE, WHITE } from '@platformatic/ui-components/src/components/constants'
import { Icons } from '@platformatic/ui-components'

function Title ({ title, iconName, dataAttrName, dataAttrValue }) {
  const icon = React.createElement(Icons[`${iconName}`], {
    color: WHITE,
    size: LARGE
  })

  const dataProps = {}
  if (dataAttrName && dataAttrValue) {
    dataProps[`data-${dataAttrName}`] = dataAttrValue
  }

  return (
    <div className={commonStyles.smallFlexRow} {...dataProps}>
      {icon}
      <h2 className={`${typographyStyles.desktopHeadline2} ${typographyStyles.textWhite}`}>{title}</h2>
    </div>
  )
}

Title.propTypes = {
  /**
     * title
     */
  title: PropTypes.string.isRequired,
  /**
     * iconName
     */
  iconName: PropTypes.string.isRequired,
  /**
   * dataAttrName
  */
  dataAttrName: PropTypes.string,
  /**
   * dataAttrValue
  */
  dataAttrValue: PropTypes.string
}

Title.defaultProps = {
  dataAttrName: '',
  dataAttrValue: ''
}

export default Title
