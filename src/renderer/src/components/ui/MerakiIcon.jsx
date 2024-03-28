'use strict'
import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Icons from './icons'
import styles from './MerakiIcon.module.css'
import { COLORS_ICON, MAIN_GREEN, SIZES, SMALL } from '@platformatic/ui-components/src/components/constants'

function MerakiIcon ({
  iconName,
  color,
  onClick,
  size,
  classes,
  disabled,
  inactive,
  internalOverHandling,
  ...rest
}) {
  const [hover, setHover] = useState(false)
  let icon = <></>
  if (iconName) {
    icon = React.createElement(Icons[`${iconName}`], {
      color,
      size,
      disabled,
      inactive: internalOverHandling ? !hover : inactive,
      ...rest
    })
    if (onClick && !disabled) {
      let className = `${styles.cursorPointer} `
      if (classes) className += ` ${classes}`
      icon = (
        <div
          className={className}
          onClick={onClick}
          onMouseOver={() => internalOverHandling && !disabled ? setHover(true) : {}}
          onMouseLeave={() => internalOverHandling && !disabled ? setHover(false) : {}}
        >
          {icon}
        </div>
      )
    }
  }

  return (
    <>
      {icon}
    </>
  )
}

MerakiIcon.propTypes = {
  /**
   * iconName
   */
  iconName: PropTypes.string.isRequired,
  /**
   * color
   */
  color: PropTypes.oneOf(COLORS_ICON),
  /**
   * size
   */
  size: PropTypes.oneOf(SIZES),
  /**
   * onClick
   */
  onClick: PropTypes.func,
  /**
   * classes
   */
  classes: PropTypes.string,
  /**
   * disabled
   */
  disabled: PropTypes.bool,
  /**
   * inactive
   */
  inactive: PropTypes.bool,
  /**
   * handleOverInternally
   */
  internalOverHandling: PropTypes.bool
}

MerakiIcon.defaultProps = {
  iconName: '',
  color: MAIN_GREEN,
  size: SMALL,
  onClick: () => {},
  classes: '',
  disabled: false,
  inactive: false,
  internalOverHandling: false
}

export default MerakiIcon
