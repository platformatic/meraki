'use strict'
import React from 'react'
import PropTypes from 'prop-types'
import typographyStyles from '~/styles/Typography.module.css'
import commonStyles from '~/styles/CommonStyles.module.css'
import { LARGE, WHITE } from '@platformatic/ui-components/src/components/constants'
import { Icons } from '@platformatic/ui-components'

function Title ({ title, iconName }) {
  const icon = React.createElement(Icons[`${iconName}`], {
    color: WHITE,
    size: LARGE
  })

  return (
    <div className={commonStyles.mediumFlexRow}>
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
  iconName: PropTypes.string.isRequired
}

export default Title
