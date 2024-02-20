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
import SmallTitle from '~/components/ui/SmallTitle'
import RuntimeLargeCardGridView from '../backgrounds/RuntimeLargeCardGridView'
import { SMALL, WHITE } from '@platformatic/ui-components/src/components/constants'

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
        <SmallTitle
          title='Platformatic Runtime'
          titleClassName={`${typographyStyles.desktopBodyLarge} ${typographyStyles.textWhite} ${styles.cursorDefault}`}
          containerClassName={`${commonStyles.smallFlexRow} ${typographyStyles.textCenter}`}
          platformaticIcon={{
            iconName: 'CircleExclamationIcon',
            disabled: false,
            inactive: false,
            color: WHITE,
            size: SMALL,
            tip: 'Platformatic Runtime is an environment for running multiple Platformatic microservices as a single monolithic deployment unit.'
          }}
        />
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
