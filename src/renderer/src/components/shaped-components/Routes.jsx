'use strict'
import typographyStyles from '~/styles/Typography.module.css'
import styles from './Routes.module.css'
import commonStyles from '~/styles/CommonStyles.module.css'
import SmallTitle from '../ui/SmallTitle'
import React from 'react'
import { SMALL, WHITE } from '@platformatic/ui-components/src/components/constants'

const Routes = React.forwardRef(({ _object }, ref) => {
  return (
    <div className={styles.container} ref={ref}>
      <svg viewBox='0 0 264 58' fill='none' preserveAspectRatio='none' xmlns='http://www.w3.org/2000/svg' className={styles.svg}>
        <rect y={0.113708} width={264} height={57} rx={4} fill='none' className={styles.rectFilled} />
        <rect x={0.5} y={0.613708} width={263} height={56} rx={3.5} stroke='none' className={styles.rectBordered} />
      </svg>

      <div className={`${commonStyles.smallFlexBlock} ${commonStyles.itemsCenter}`}>
        <SmallTitle
          title='routes'
          titleClassName={`${typographyStyles.desktopBody} ${typographyStyles.textWhite} ${typographyStyles.opacity70}`}
          containerClassName={`${commonStyles.tinyFlexRow} ${typographyStyles.textCenter}`}
          platformaticIcon={{
            iconName: 'FoldersIcon',
            disabled: false,
            inactive: false,
            color: WHITE,
            size: SMALL,
            tip: ''
          }}
        />
      </div>
    </div>
  )
})

export default Routes
