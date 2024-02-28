import * as React from 'react'
import PropTypes from 'prop-types'
import styles from './Icons.module.css'
import { COLORS_ICON, SIZES, MEDIUM, WHITE } from '@platformatic/ui-components/src/components/constants'

const MerakiLogoIcon = ({ color, size, disabled, inactive }) => {
  let className = `${styles.svgClassName} ` + styles[`${color}`]
  if (disabled) {
    className += ` ${styles.iconDisabled}`
  }
  if (inactive) {
    className += ` ${styles.iconInactive}`
  }
  let icon = <></>

  switch (size) {
    case MEDIUM:
      icon = (
        <svg
          width={24}
          height={24}
          viewBox='0 0 24 24'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
          className={className}
        >
          <path d='M14.9929 14.9857C18.3105 14.9857 20.9999 12.3051 20.9999 8.99836C20.9999 5.69162 18.3105 3.01099 14.9929 3.01099C11.6753 3.01099 8.98584 5.69162 8.98584 8.99836C8.98584 12.3051 11.6753 14.9857 14.9929 14.9857Z' stroke='none' strokeWidth={1.5} strokeLinecap='round' strokeLinejoin='round' />
          <path d='M3 8.99976V21L13.5026 14.9995L3 8.99976Z' stroke='none' strokeWidth={1.5} strokeLinecap='round' strokeLinejoin='round' />
          <path d='M15.0396 3H3V15.0002H15.0396V3Z' stroke='none' strokeWidth={1.5} strokeLinecap='round' strokeLinejoin='round' />
        </svg>
      )
      break

    default:
      break
  }
  return icon
}

MerakiLogoIcon.propTypes = {
  /**
   * color of text, icon and borders
   */
  color: PropTypes.oneOf(COLORS_ICON),
  /**
   * Size
   */
  size: PropTypes.oneOf(SIZES),
  /**
   * disabled
   */
  disabled: PropTypes.bool,
  /**
   * inactive
   */
  inactive: PropTypes.bool
}
MerakiLogoIcon.defaultProps = {
  color: WHITE,
  size: MEDIUM,
  disabled: false,
  inactive: false
}

export default MerakiLogoIcon
