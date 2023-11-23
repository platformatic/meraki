'use strict'
import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import commonStyles from '~/styles/CommonStyles.module.css'
import typographyStyles from '~/styles/Typography.module.css'
import styles from './ConfigureServiceHeaderTab.module.css'

function ConfigureServiceHeaderTab ({
  serviceName,
  serviceNameSelected,
  isConfigured,
  position,
  onClick
}) {
  const [titleClassName, setTitleClassName] = useState(`${typographyStyles.desktopHeadline5} ${typographyStyles.textWhite} `)
  const titleClassNormal = `${typographyStyles.desktopHeadline5} ${typographyStyles.textWhite} ${styles.minHeightTab} ${styles.ellipsis}`
  const titleClassSelected = `${titleClassNormal} ${typographyStyles.opacity70}`

  let containerClassName = `${commonStyles.smallFlexRow} ${commonStyles.itemsCenter} ${styles.cursorPointer}`
  if (position === 0) containerClassName += ` ${styles.firstContainer}`
  else containerClassName += ` ${styles.container}`

  useEffect(() => {
    if (serviceNameSelected !== serviceName) {
      setTitleClassName(titleClassNormal)
    } else {
      setTitleClassName(titleClassSelected)
    }
  }, [serviceNameSelected])

  return (
    <div className={containerClassName} onClick={() => onClick()}>
      <h5 className={titleClassName}>{serviceName}</h5>
      {isConfigured && <span className={`${typographyStyles.desktopBodySmallest} ${typographyStyles.textMainGreen}`}>Configured</span>}
    </div>
  )
}

ConfigureServiceHeaderTab.propTypes = {
  /**
   * serviceName
   */
  serviceName: PropTypes.string.isRequired,
  /**
   * serviceNameSelected
   */
  serviceNameSelected: PropTypes.string,
  /**
   * isConfigured
   */
  isConfigured: PropTypes.bool,
  /**
   * position
   */
  position: PropTypes.number,
  /**
   * onClick
   */
  onClick: PropTypes.func
}

ConfigureServiceHeaderTab.defaultProps = {
  isSelected: false,
  isConfigured: false,
  position: 0,
  onClick: () => {}
}

export default ConfigureServiceHeaderTab
