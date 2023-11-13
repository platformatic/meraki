'use strict'
import PropTypes from 'prop-types'
import typographyStyles from '~/styles/Typography.module.css'
import styles from './AddService.module.css'
import commonStyles from '~/styles/CommonStyles.module.css'
import SmallTitle from '../ui/SmallTitle'
import React from 'react'

const AddService = React.forwardRef(({ onClick }, ref) => {
  return (
    <div className={styles.container} onClick={() => onClick()} ref={ref}>
      <svg width={264} height='100%' viewBox='0 0 264 100%' fill='none' xmlns='http://www.w3.org/2000/svg' className={styles.svg}>
        <rect x='0.5' y='0.613281' width='263' height='100%' rx={3.5} stroke='none' strokeOpacity={0.3} strokeDasharray='8 8' />
      </svg>

      <div className={`${commonStyles.smallFlexBlock} ${commonStyles.itemsCenter}`}>
        <SmallTitle
          iconName='CircleAddIcon'
          title='Add Service'
          titleClassName={`${typographyStyles.desktopBodyLarge} ${typographyStyles.textWhite} ${typographyStyles.opacity70}`}
          containerClassName={`${commonStyles.smallFlexRow} ${commonStyles.textCenter}`}
        />
      </div>
    </div>
  )
})

AddService.propTypes = {
  /**
   * onClick
    */
  onClick: PropTypes.func
}

AddService.defaultProps = {
  onClick: () => {}
}

export default AddService
