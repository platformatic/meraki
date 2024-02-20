'use strict'
import React from 'react'
import PropTypes from 'prop-types'
import commonStyles from '~/styles/CommonStyles.module.css'
import typographyStyles from '~/styles/Typography.module.css'
import { PlatformaticIcon } from '@platformatic/ui-components'

function SmallTitle ({
  containerClassName,
  title,
  titleClassName,
  platformaticIcon
}) {
  const icon = React.createElement(PlatformaticIcon, platformaticIcon)

  return (
    <div className={containerClassName}>
      {icon}
      <span className={titleClassName} title={title}>{title}</span>
    </div>
  )
}

SmallTitle.propTypes = {
  /**
   * containerClassName
   */
  containerClassName: PropTypes.string,
  /**
   * platformaticIcon
   */
  platformaticIcon: PropTypes.shape({
    iconName: PropTypes.string,
    disabled: PropTypes.bool,
    inactive: PropTypes.bool,
    tip: PropTypes.string,
    color: PropTypes.string,
    size: PropTypes.string
  }),
  /**
   * iconTip
   */
  iconTip: PropTypes.string,
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
  titleClassName: `${typographyStyles.desktopBodyLarge} ${typographyStyles.textWhite} ${typographyStyles.opacity70}`,
  platformaticIcon: {}
}
export default SmallTitle
