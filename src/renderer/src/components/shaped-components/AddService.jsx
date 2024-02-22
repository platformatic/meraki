'use strict'
import PropTypes from 'prop-types'
import typographyStyles from '~/styles/Typography.module.css'
import styles from './AddService.module.css'
import commonStyles from '~/styles/CommonStyles.module.css'
import SmallTitle from '../ui/SmallTitle'
import React, { useRef, useState, useEffect } from 'react'
import { SMALL, WHITE } from '@platformatic/ui-components/src/components/constants'

function AddService ({ onClick, enabled }) {
  const [hover, setHover] = useState(false)
  const ref = useRef(null)
  const [titleClassName, setTitleClassName] = useState(`${typographyStyles.desktopBodyLarge} ${typographyStyles.textWhite} `)

  useEffect(() => {
    if (enabled) {
      if (hover) {
        setTitleClassName(`${typographyStyles.desktopBodyLarge} ${typographyStyles.textWhite}`)
      } else {
        setTitleClassName(`${typographyStyles.desktopBodyLarge} ${typographyStyles.textWhite} ${typographyStyles.opacity70}`)
      }
    } else {
      setTitleClassName(`${typographyStyles.desktopBodyLarge} ${typographyStyles.textWhite} ${typographyStyles.opacity30}`)
    }
  }, [hover, enabled])

  function handleOnClick () {
    setHover(false)
    onClick()
  }
  return (
    <div
      className={`${styles.container} ${hover && enabled ? styles.containerEnabled : ''}`}
      onClick={() => enabled ? handleOnClick() : {}}
      ref={ref}
      {...{ 'data-cy': 'add-service' }}
      onMouseLeave={() => enabled ? setHover(false) : {}}
      onMouseOver={() => enabled ? setHover(true) : {}}
    >
      <svg
        viewBox='0 0 264 440'
        fill={hover ? 'white' : 'none'}
        preserveAspectRatio='none'
        xmlns='http://www.w3.org/2000/svg'
        className={styles.svg}
        fillOpacity={hover ? 0.15 : 0}
      >
        <rect
          x='0.5' y='0.613281'
          width={263}
          height={438} rx={3.5}
          stroke='none'
          strokeOpacity={enabled ? (hover ? 1 : 0.7) : 0.3}
          strokeDasharray='8 8'
        />
      </svg>

      <div className={`${commonStyles.smallFlexBlock} ${commonStyles.itemsCenter}`}>
        <SmallTitle
          title='Add Service'
          titleClassName={titleClassName}
          containerClassName={`${commonStyles.smallFlexRow} ${typographyStyles.textCenter}`}
          platformaticIcon={{
            iconName: 'CircleAddIcon',
            disabled: !enabled,
            inactive: !hover,
            color: WHITE,
            size: SMALL,
            tip: ''
          }}
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
