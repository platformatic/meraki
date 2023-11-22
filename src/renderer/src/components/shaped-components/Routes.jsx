'use strict'
import typographyStyles from '~/styles/Typography.module.css'
import styles from './Routes.module.css'
import commonStyles from '~/styles/CommonStyles.module.css'
import SmallTitle from '../ui/SmallTitle'
import React from 'react'

const Routes = React.forwardRef(({ _object }, ref) => {
  return (
    <div className={styles.container} ref={ref}>
      <svg width={264} height={58} viewBox='0 0 264 58' fill='none' xmlns='http://www.w3.org/2000/svg' className={styles.svg}>
        <rect y={0.113708} width={264} height={57} rx={4} fill='none' className={styles.rectFilled} />
        <rect x={0.5} y={0.613708} width={263} height={56} rx={3.5} stroke='none' className={styles.rectBordered} />
      </svg>

      <div className={`${commonStyles.smallFlexBlock} ${commonStyles.itemsCenter}`}>
        <SmallTitle
          iconName='FoldersIcon'
          title='routes'
          titleClassName={`${typographyStyles.desktopBodyLarge} ${typographyStyles.textWhite} ${typographyStyles.opacity70}`}
          containerClassName={`${commonStyles.smallFlexRow} ${typographyStyles.textCenter}`}
        />
      </div>
    </div>
  )
})

export default Routes
