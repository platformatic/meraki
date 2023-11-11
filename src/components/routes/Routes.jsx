'use strict'
import { SMALL, WHITE } from '@platformatic/ui-components/src/components/constants'
import Icons from '@platformatic/ui-components/src/components/icons'
import commonStyles from '~/styles/CommonStyles.module.css'
import typographyStyles from '~/styles/Typography.module.css'
import styles from './Routes.module.css'

function Routes () {
  return (
    <div className={styles.routes}>
      <div className={`${commonStyles.smallFlexBlock} ${commonStyles.itemsCenter}`}>
        <div className={`${commonStyles.smallFlexRow} ${commonStyles.textCenter}`}>
          <Icons.CircleAddIcon color={WHITE} size={SMALL} />
          <span className={`${typographyStyles.desktopBodyLarge} ${typographyStyles.textWhite} ${typographyStyles.opacity70}`}>routes</span>
        </div>
      </div>
    </div>

  )
}

export default Routes
