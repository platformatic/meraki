'use strict'
import React from 'react'
import PropTypes from 'prop-types'
import typographyStyles from '~/styles/Typography.module.css'
import commonStyles from '~/styles/CommonStyles.module.css'
import { Icons } from '@platformatic/ui-components'
import { LARGE, WHITE } from '@platformatic/ui-components/src/components/constants'

function NoResults ({ iconName, searchedValue, dataAttrName, dataAttrValue, title }) {
  const dataProps = {}
  if (dataAttrName && dataAttrValue) {
    dataProps[`data-${dataAttrName}`] = dataAttrValue
  }

  function getIcon () {
    if (iconName) {
      return React.createElement(Icons[`${iconName}`], {
        color: WHITE,
        size: LARGE
      })
    }
    return <></>
  }

  return (
    <div className={`${commonStyles.mediumFlexBlock} ${typographyStyles.textCenter} ${commonStyles.fullWidth} ${commonStyles.itemsCenter} ${commonStyles.justifyCenter}`} {...dataProps}>
      {getIcon()}
      <div className={`${commonStyles.smallFlexBlock} ${commonStyles.itemsCenter}`}>
        <p className={`${typographyStyles.desktopBodyLarge} ${typographyStyles.textWhite} `}>{title}</p>
        <p className={`${typographyStyles.desktopBody} ${typographyStyles.textWhite} ${typographyStyles.opacity70}`}>Your search for "{searchedValue}" did not return any results.</p>
      </div>
    </div>
  )
}

NoResults.propTypes = {
  /**
     * searchedValue
     */
  searchedValue: PropTypes.string.isRequired,
  /**
   * dataAttrName
  */
  dataAttrName: PropTypes.string,
  /**
   * dataAttrValue
  */
  dataAttrValue: PropTypes.string,
  /**
   * title
  */
  title: PropTypes.string,
  /**
   * iconName
  */
  iconName: PropTypes.string
}

NoResults.defaultProps = {
  dataAttrName: '',
  dataAttrValue: '',
  searchedValue: '',
  title: 'No results found',
  iconName: ''
}

export default NoResults
