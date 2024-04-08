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
import { SMALL, WHITE } from '@platformatic/ui-components/src/components/constants'
import tooltipStyles from '~/styles/TooltipStyles.module.css'
import { PlatformaticIcon, TooltipAbsolute } from '@platformatic/ui-components'

function PlatformaticRuntimeButton ({ view }) {
  const globalState = useStackablesStore()
  const { services } = globalState
  const [currentBackgroundComponent, setCurrentBackgroundComponent] = useState(<RuntimeSmallCard classNameSvg={styles.svg} />)

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
          <TooltipAbsolute
            tooltipClassName={`${tooltipStyles.tooltipDarkStyle} ${styles.smallMargin}`}
            content={(<span>Platformatic Runtime is an environment <br />for running multiple Platformatic microservices <br />as a single monolithic deployment unit.</span>)}
            offset={80}
          >
            <PlatformaticIcon iconName='CircleExclamationIcon' color={WHITE} size={SMALL} onClick={() => {}} internalOverHandling />
          </TooltipAbsolute>
          <span className={`${typographyStyles.desktopBody} ${typographyStyles.textWhite} ${styles.cursorDefault}`} title='Platformatic Runtime'>Platformatic Runtime</span>
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
