'use strict'
import PropTypes from 'prop-types'
import typographyStyles from '~/styles/Typography.module.css'
import styles from './AddService.module.css'
import commonStyles from '~/styles/CommonStyles.module.css'
import SmallTitle from '../ui/SmallTitle'
import React, { useRef } from 'react'

function AddService ({ onClick, enabled }) {
  const ref = useRef(null)
  let classNameContainer = `${styles.container} `
  let titleClassName = `${typographyStyles.desktopBodyLarge} ${typographyStyles.textWhite} `
  if (enabled) {
    classNameContainer += styles.containerEnabled
  } else {
    titleClassName += `${typographyStyles.opacity70}`
  }

  return (
    <div className={classNameContainer} onClick={() => enabled ? onClick() : {}} ref={ref} {...{ 'data-cy': 'add-service' }}>
      <svg width={264} height={440} viewBox='0 0 264 440' fill='none' xmlns='http://www.w3.org/2000/svg' className={styles.svg}>
        <rect x='0.5' y='0.613281' width={263} height={438} rx={3.5} stroke='none' strokeOpacity={enabled ? 1 : 0.3} strokeDasharray='8 8' />
      </svg>

      <div className={`${commonStyles.smallFlexBlock} ${commonStyles.itemsCenter}`}>
        <SmallTitle
          iconName='CircleAddIcon'
          title='Add Service'
          titleClassName={titleClassName}
          containerClassName={`${commonStyles.smallFlexRow} ${typographyStyles.textCenter}`}
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
