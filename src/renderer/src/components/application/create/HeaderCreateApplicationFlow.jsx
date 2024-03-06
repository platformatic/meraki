'use strict'
import styles from './HeaderCreateApplicationFlow.module.css'
import commonStyles from '~/styles/CommonStyles.module.css'
import { WHITE, MARGIN_0, OPACITY_30 } from '@platformatic/ui-components/src/components/constants'
import MerakiLogo from '~/components/ui/MerakiLogo'
import { HorizontalSeparator } from '@platformatic/ui-components'

function HeaderCreateApplicationFlow () {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={`${commonStyles.largeFlexRow} ${commonStyles.itemsCenter}`}>
          <MerakiLogo />
        </div>
      </div>
      <HorizontalSeparator marginBottom={MARGIN_0} marginTop={MARGIN_0} color={WHITE} opacity={OPACITY_30} />
    </div>
  )
}

export default HeaderCreateApplicationFlow
