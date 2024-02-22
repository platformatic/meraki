'use strict'
import React, { useState } from 'react'
import PropTypes from 'prop-types'
import typographyStyles from '~/styles/Typography.module.css'
import commonStyles from '~/styles/CommonStyles.module.css'
import styles from './SideBar.module.css'
import { ButtonOnlyIcon } from '@platformatic/ui-components'
import { DULLS_BACKGROUND_COLOR, RICH_BLACK, SMALL, WHITE } from '@platformatic/ui-components/src/components/constants'

function SideBar ({ selected, topItems }) {
  function Item ({ item }) {
    const [hover, setHover] = useState(false)

    return (
      <div
        className={`${commonStyles.smallFlexBlock} ${commonStyles.itemsCenter} ${typographyStyles.desktopBodySmallest} ${typographyStyles.textWhite} ${typographyStyles.textCenter} ${hover ? '' : typographyStyles.opacity70}`}
        onMouseLeave={() => setHover(false) }
        onMouseOver={() => setHover(true) }
      >
        <ButtonOnlyIcon
          altLabel={item.label}
          paddingClass={commonStyles.buttonSquarePadding}
          color={WHITE}
          backgroundColor={RICH_BLACK}
          onClick={() => item.onClick()}
          hoverEffect={DULLS_BACKGROUND_COLOR}
          platformaticIcon={{ size: SMALL, iconName: item.iconName, color: WHITE }}
        />
        <span>{item.label}</span>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      {topItems.map((item, index) => <Item item={item} key={index} />)}
    </div>
  )
}

SideBar.propTypes = {
  /**
   * selected
   */
  selected: PropTypes.string,
  /**
   * topItems
   */
  topItems: PropTypes.array
}

SideBar.defaultProps = {
  topItems: []
}

export default SideBar
