'use strict'
import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { MAIN_GREEN, LARGE } from '@platformatic/ui-components/src/components/constants'
import Icons from '@platformatic/ui-components/src/components/icons'
import typographyStyles from '~/styles/Typography.module.css'
import styles from './ChangeTemplate.module.css'
import commonStyles from '~/styles/CommonStyles.module.css'
import { DEFAULT_HEIGHT_TEMPLATE } from '~/ui-constants'
import BrickPath from './BrickPath'

function ChangeTemplate ({
  showIcon,
  onClick,
  name,
  height,
  useRefForWidth,
  preciseWidth,
  clickable
}) {
  const style = {
    maxHeight: height,
    minHeight: height
  }
  const ref = useRef(null)
  const [width, setWidth] = useState(0)
  let className = `${styles.container}`
  if (clickable) className += ` ${styles.containerClickable}`

  useEffect(() => {
    if (ref?.current) {
      if (useRefForWidth) {
        setWidth(ref.current.clientWidth)
      } else {
        setWidth(preciseWidth)
      }
    }
  }, [ref?.current])

  return (
    <div className={className} style={style} onClick={() => clickable ? onClick() : {}} ref={ref}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill='none' xmlns='http://www.w3.org/2000/svg' className={styles.svg}>
        {height === DEFAULT_HEIGHT_TEMPLATE
          ? (<BrickPath width={width} height={height} />)
          /* ? (
            <path d='M263.5 10.3335V283.114C263.5 285.047 261.933 286.614 260 286.614H4C2.067 286.614 0.5 285.047 0.5 283.114V10.3335C0.5 8.40052 2.067 6.83352 4 6.83352H7.58024C9.57393 6.83352 11.1901 5.21731 11.1901 3.22362C11.1901 1.7822 12.3586 0.613708 13.8 0.613708H59.1718C60.6132 0.613708 61.7817 1.7822 61.7817 3.22362C61.7817 5.21731 63.3979 6.83352 65.3916 6.83352H72.1654C73.9137 6.83352 75.331 5.41622 75.331 3.66789C75.331 2.00214 76.7504 0.613708 78.5493 0.613708H122.704C124.503 0.613708 125.923 2.00214 125.923 3.66789C125.923 5.41622 127.34 6.83352 129.088 6.83352H134.447C136.195 6.83352 137.613 5.41622 137.613 3.66789C137.613 2.00215 139.032 0.613708 140.831 0.613708H184.986C186.785 0.613708 188.204 2.00214 188.204 3.66789C188.204 5.41622 189.622 6.83352 191.37 6.83352H199.517C201.266 6.83352 202.683 5.41622 202.683 3.66789C202.683 2.00214 204.102 0.613708 205.901 0.613708H250.056C251.855 0.613708 253.275 2.00214 253.275 3.66789C253.275 5.41622 254.692 6.83352 256.44 6.83352H260C261.933 6.83352 263.5 8.40053 263.5 10.3335Z' fill='none' fillOpacity={0.3} stroke='none' />
            ) */
          : (
            <>
              <rect x={0.5} y={1.02789} width={width - 1} height={height - 2} rx={3.5} fill='none' className={styles.rectFilled} />
              <rect x={0.5} y={1.02789} width={width - 1} height={height - 2} rx={3.5} stroke='none' className={styles.rectBordered} />
            </>
            )}
      </svg>
      <div className={`${commonStyles.smallFlexBlock} ${commonStyles.itemsCenter} ${styles.content}`}>
        {showIcon && <Icons.StackablesTemplateIcon color={MAIN_GREEN} size={LARGE} />}
        <p className={`${typographyStyles.desktopBodyLarge} ${typographyStyles.textWhite} ${typographyStyles.textCenter}`}>{name}</p>
        {clickable && <p className={`${typographyStyles.desktopBodySmall} ${typographyStyles.textWhite} ${typographyStyles.textCenter} ${typographyStyles.opacity70}`}>Change Template</p>}
      </div>
    </div>
  )
}

ChangeTemplate.propTypes = {
  /**
   * showIcon
    */
  showIcon: PropTypes.bool,
  /**
   * onClick
    */
  onClick: PropTypes.func,
  /**
   * name
    */
  name: PropTypes.string,
  /**
   * height
    */
  height: PropTypes.number,
  /**
   * useRefForWidth
    */
  useRefForWidth: PropTypes.bool,
  /**
   * preciseWidth
    */
  preciseWidth: PropTypes.number,
  /**
   * clickable
    */
  clickable: PropTypes.bool

}

ChangeTemplate.defaultProps = {
  showIcon: true,
  onClick: () => {},
  name: '',
  height: DEFAULT_HEIGHT_TEMPLATE,
  useRefForWidth: true,
  preciseWidth: 0,
  clickable: true
}

export default ChangeTemplate
