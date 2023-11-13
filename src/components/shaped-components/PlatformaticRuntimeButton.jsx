'use strict'
import React, { useEffect, useState } from 'react'
import Icons from '@platformatic/ui-components/src/components/icons'
import typographyStyles from '~/styles/Typography.module.css'
import styles from './PlatformaticRuntimeButton.module.css'
import RuntimeSmallCard from '../backgrounds/RuntimeSmallCard'
import { BorderedBox } from '@platformatic/ui-components'
import { SMALL, TRANSPARENT, WHITE } from '@platformatic/ui-components/src/components/constants'
import useStackablesStore from '~/useStackablesStore'
import RuntimeLargeCard from '../backgrounds/RuntimeLargeCard'
import RuntimeMediumCard from '../backgrounds/RuntimeMediumCard'

const PlatformaticRuntimeButton = React.forwardRef(() => {
  const globalState = useStackablesStore()
  const { services } = globalState
  const [currentBackgrounComponent, setCurrentBackgrounComponent] = useState(<RuntimeSmallCard classNameSvg={styles.svg} />)

  useEffect(() => {
    if (services.length > 0) {
      switch (services.length) {
        case 2:
          setCurrentBackgrounComponent(<RuntimeMediumCard classNameSvg={styles.svg} />)
          break

        case 3:
          setCurrentBackgrounComponent(<RuntimeLargeCard classNameSvg={styles.svg} />)
          break

        default:
          setCurrentBackgrounComponent(<RuntimeSmallCard classNameSvg={styles.svg} />)
          break
      }
    }
  }, [services.length])

  return (
    <div className={styles.container}>
      {currentBackgrounComponent}
      <BorderedBox
        color={WHITE}
        backgroundColor={TRANSPARENT}
        classes={styles.platformaticRuntimeButton}
      >
        <Icons.CircleExclamationIcon color={WHITE} size={SMALL} />
        <span className={`${typographyStyles.desktopBodyLarge} ${typographyStyles.textWhite} ${typographyStyles.opacity70}`}>Platformatic Runtime</span>
      </BorderedBox>
    </div>

  )
})

export default PlatformaticRuntimeButton
