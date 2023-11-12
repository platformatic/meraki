'use strict'
import React from 'react'
import PropTypes from 'prop-types'
import typographyStyles from '~/styles/Typography.module.css'
import styles from './Plugin.module.css'
import commonStyles from '~/styles/CommonStyles.module.css'
import { PlatformaticIcon } from '@platformatic/ui-components'
import { MEDIUM, WHITE } from '@platformatic/ui-components/src/components/constants'

const Plugin = React.forwardRef(({ onClick, index, name }, ref) => {
  return (
    <div className={styles.container} onClick={() => onClick()} ref={ref}>
      <svg width={262} height={106} viewBox='0 0 262 106' fill='none' xmlns='http://www.w3.org/2000/svg' className={styles.svg}>
        {index === 0
          ? <path
              d='M261.5 12.6544V101.114C261.5 103.047 259.933 104.614 258 104.614H4C2.06701 104.614 0.5 103.047 0.5 101.114V12.6544C0.5 10.7214 2.067 9.15438 4 9.15438H9.83803C12.3233 9.15438 14.338 7.13966 14.338 4.65438V4.11371C14.338 2.18071 15.905 0.613708 17.838 0.613708H55.5035C57.4365 0.613708 59.0035 2.18071 59.0035 4.11371V4.65438C59.0035 7.13966 61.0182 9.15438 63.5035 9.15438H68.2676H72.8803C75.2338 9.15438 77.0704 7.09004 77.0704 4.63524V4.13285C77.0704 2.14822 78.538 0.613708 80.2606 0.613708H118.546C120.268 0.613708 121.736 2.14822 121.736 4.13285V4.63524C121.736 7.09004 123.573 9.15438 125.926 9.15438H130.077H134.69C137.044 9.15438 138.88 7.09003 138.88 4.63524V4.13285C138.88 2.14823 140.348 0.613708 142.07 0.613708H180.356C182.078 0.613708 183.546 2.14822 183.546 4.13285V4.63524C183.546 7.09003 185.382 9.15438 187.736 9.15438H191.887H196.5C198.854 9.15438 200.69 7.09003 200.69 4.63524V4.13285C200.69 2.14823 202.158 0.613708 203.88 0.613708H213.798H242.165C243.888 0.613708 245.356 2.14822 245.356 4.13285V4.63524C245.356 7.09003 247.192 9.15438 249.546 9.15438H258C259.933 9.15438 261.5 10.7214 261.5 12.6544Z'
              fill='none' fillOpacity={0.15} stroke='none'
            />
          : <></>}
      </svg>

      <div className={`${commonStyles.mediumFlexRow} ${commonStyles.justifyBetween} ${commonStyles.itemsCenter} ${styles.content}`}>
        <div className={`${commonStyles.smallFlexRow} ${commonStyles.itemsCenter} ${styles.leftContent}`}>
          <PlatformaticIcon iconName='CircleAddIcon' color={WHITE} size={MEDIUM} />
          <span className={`${typographyStyles.desktopBodyLarge} ${typographyStyles.textWhite} ${typographyStyles.opacity70} ${styles.ellipsis}`} title={name}>{name}</span>
        </div>
      </div>
      <div className={styles.deleteContainer}>
        <PlatformaticIcon iconName='CircleAddIcon' color={WHITE} size={MEDIUM} />
      </div>
    </div>
  )
})

Plugin.propTypes = {
  /**
   * onClick
    */
  onClick: PropTypes.func,
  /**
   * name
    */
  name: PropTypes.string,
  /**
   * index
    */
  index: PropTypes.number
}

Plugin.defaultProps = {
  onClick: () => {},
  name: '',
  index: 0
}

export default Plugin
