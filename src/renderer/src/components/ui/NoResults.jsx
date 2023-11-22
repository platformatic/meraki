'use strict'
import React from 'react'
import PropTypes from 'prop-types'
import typographyStyles from '~/styles/Typography.module.css'
import commonStyles from '~/styles/CommonStyles.module.css'

function NoResults ({ searchedValue, dataAttrName, dataAttrValue }) {
  const dataProps = {}
  if (dataAttrName && dataAttrValue) {
    dataProps[`data-${dataAttrName}`] = dataAttrValue
  }

  return (
    <div className={`${commonStyles.mediumFlexBlock} ${typographyStyles.textCenter} ${commonStyles.fullWidth} ${commonStyles.itemsCenter} ${commonStyles.justifyCenter}`} {...dataProps}>
      <div className={`${commonStyles.smallFlexBlock} ${commonStyles.itemsCenter}`}>
        <p className={`${typographyStyles.desktopBodyLarge} ${typographyStyles.textWhite} `}>No results found</p>
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
  dataAttrValue: PropTypes.string
}

NoResults.defaultProps = {
  dataAttrName: '',
  dataAttrValue: '',
  searchedValue: ''
}

export default NoResults
