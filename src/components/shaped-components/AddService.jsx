'use strict'
import PropTypes from 'prop-types'
import typographyStyles from '~/styles/Typography.module.css'
import styles from './AddService.module.css'
import commonStyles from '~/styles/CommonStyles.module.css'
import SmallTitle from '../ui/SmallTitle'
import React, { useEffect, useRef, useState } from 'react'

function AddService ({ onClick, enabled }) {
  const [height, setHeight] = useState(0)
  const ref = useRef(null)

  console.log('enabled', enabled)

  let classNameContainer = `${styles.container} `
  let titleClassName = `${typographyStyles.desktopBodyLarge} ${typographyStyles.textWhite} `
  if (enabled) {
    console.log('enabled')
    classNameContainer += styles.containerEnabled
  } else {
    titleClassName += `${typographyStyles.opacity70}`
  }

  useEffect(() => {
    setHeight(ref.current.clientHeight)
  })

  return (
    <div className={classNameContainer} onClick={() => enabled ? onClick() : {}} ref={ref}>
      <svg width={264} height={height} viewBox={`0 0 264 ${height}`} fill='none' xmlns='http://www.w3.org/2000/svg' className={styles.svg}>
        <rect x='0.5' y='0.613281' width='263' height={height} rx={3.5} stroke='none' strokeOpacity={enabled ? 1 : 0.3} strokeDasharray='8 8' />
      </svg>

      <div className={`${commonStyles.smallFlexBlock} ${commonStyles.itemsCenter}`}>
        <SmallTitle
          iconName='CircleAddIcon'
          title='Add Service'
          titleClassName={titleClassName}
          containerClassName={`${commonStyles.smallFlexRow} ${commonStyles.textCenter}`}
        />
      </div>
    </div>
  )
}

AddService.propTypes = {
  /**
   * onClick
    */
  onClick: PropTypes.func,
  /**
   * enabled
    */
  enabled: PropTypes.bool
}

AddService.defaultProps = {
  onClick: () => {},
  enabled: false
}

export default AddService
