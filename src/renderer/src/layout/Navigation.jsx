'use strict'
import { Link } from 'react-router-dom'
import useStackablesStore from '~/useStackablesStore'
import styles from './Navigation.module.css'
import { PlatformaticIcon } from '@platformatic/ui-components'
import { SMALL, WHITE } from '@platformatic/ui-components/src/components/constants'
import typographyStyles from '~/styles/Typography.module.css'

export default function Navigation () {
  const globalState = useStackablesStore()
  const { breadCrumbs } = globalState

  return (
    <div className={styles.container}>
      <div className={styles.breadCrumbs}>
        {breadCrumbs.map((item, index) => {
          let content
          if (index < breadCrumbs.length - 1) {
            content = <Link to={item.link} key={item.link} className={`${typographyStyles.desktopBodySmall} ${typographyStyles.textWhite} ${typographyStyles.opacity70} ${styles.link}`}><span>{item.label}</span></Link>
          } else {
            content = <span key={item.label} className={`${typographyStyles.desktopBodySmall} ${typographyStyles.textWhite}`}>{item.label}</span>
          }
          if (index < breadCrumbs.length - 1) {
            return (
              <span key={item.link} className={styles.navigationElement}>
                {content}
                <PlatformaticIcon className={styles.separator} iconName='ArrowRightIcon' size={SMALL} color={WHITE} />
              </span>
            )
          }
          return content
        })}
      </div>
    </div>
  )
}
