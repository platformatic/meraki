'use strict'
import React from 'react'
import PropTypes from 'prop-types'
import commonStyles from '~/styles/CommonStyles.module.css'
import typographyStyles from '~/styles/Typography.module.css'
import { SMALL, WHITE } from '@platformatic/ui-components/src/components/constants'
import { Icons } from '@platformatic/ui-components'

function SmallTitle ({ containerClassName, iconName, title, titleClassName }) {
  const icon = React.createElement(Icons[`${iconName}`], {
    color: WHITE,
    size: SMALL
  })

  return (
    <div className={containerClassName}>
      {icon}
      <span className={titleClassName}>{title}</span>
    </div>
  )
}

SmallTitle.propTypes = {
  /**
   * containerClassName
   */
  containerClassName: PropTypes.string,
  /**
   * iconName
   */
  iconName: PropTypes.string.isRequired,
  /**
   * title
   */
  title: PropTypes.string.isRequired,
  /**
   * titleClassName
   */
  titleClassName: PropTypes.string
}

SmallTitle.defaultProps = {
  containerClassName: `${commonStyles.smallFlexRow} ${commonStyles.textCenter}`,
  titleClassName: `${typographyStyles.desktopBodyLarge} ${typographyStyles.textWhite} ${typographyStyles.opacity70}`
}
export default SmallTitle
