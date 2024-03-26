'use strict'
import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import commonStyles from '~/styles/CommonStyles.module.css'
import typographyStyles from '~/styles/Typography.module.css'
import styles from './PlatformaticRuntimeButton.module.css'
import RuntimeSmallCard from '../backgrounds/RuntimeSmallCard'
import useStackablesStore from '~/useStackablesStore'
import RuntimeLargeCard from '../backgrounds/RuntimeLargeCard'
import RuntimeMediumCard from '../backgrounds/RuntimeMediumCard'
import { NORMAL_VIEW } from '~/ui-constants'
import RuntimeLargeCardGridView from '../backgrounds/RuntimeLargeCardGridView'
import { ALIGNMENT_RIGHT, SMALL, WHITE } from '@platformatic/ui-components/src/components/constants'
import { TooltipV2 } from '@platformatic/ui-components'
import tooltipStyles from '~/styles/TooltipStyles.module.css'
import Icons from '@platformatic/ui-components/src/components/icons'

function PlatformaticRuntimeButton ({ view }) {
  const globalState = useStackablesStore()
  const { services } = globalState
  const [currentBackgroundComponent, setCurrentBackgroundComponent] = useState(<RuntimeSmallCard classNameSvg={styles.svg} />)
  const [iconOver, setIconOver] = useState(false)

  useEffect(() => {
    if (services.length > 0) {
      switch (services.length) {
        case 0:
        case 1:
          setCurrentBackgroundComponent(<RuntimeSmallCard classNameSvg={styles.svg} />)
          break
        case 2:
          setCurrentBackgroundComponent(<RuntimeMediumCard classNameSvg={styles.svg} />)
          break

        default:
          if (view === NORMAL_VIEW) {
            setCurrentBackgroundComponent(<RuntimeLargeCard classNameSvg={styles.svg} />)
          } else {
            setCurrentBackgroundComponent(<RuntimeLargeCardGridView classNameSvg={styles.svg} />)
          }
          break
      }
    }
  }, [services.length, view])

  return (
    <div className={styles.container}>
      {currentBackgroundComponent}
      <div className={`${commonStyles.smallFlexBlock} ${commonStyles.itemsCenter} ${styles.buttonContainer}`}>
        <div className={`${commonStyles.tinyFlexRow} ${typographyStyles.textCenter}`}>
          <div className={`${styles.iconContainer} container-circle-icon`} onMouseOver={() => setIconOver(false)} onMouseLeave={() => setIconOver(false)}>
            <Icons.CircleExclamationIcon color={WHITE} size={SMALL} />
            {iconOver && <TooltipV2 tooltipClassName={tooltipStyles.tooltipDarkStyle} text='Platformatic Runtime is an environment for running multiple Platformatic microservices as a single monolithic deployment unit.' visible alignment={ALIGNMENT_RIGHT} elementClassName='container-circle-icon' />}
          </div>
          <span className={`${typographyStyles.desktopBodyLarge} ${typographyStyles.textWhite} ${styles.cursorDefault}`} title='Platformatic Runtime'>Platformatic Runtime</span>
        </div>
      </div>
    </div>

  )
}

PlatformaticRuntimeButton.propTypes = {
  /**
   * view
    */
  view: PropTypes.string
}

PlatformaticRuntimeButton.defaultProps = {
  view: NORMAL_VIEW
}

export default PlatformaticRuntimeButton
