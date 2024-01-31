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
import LineConnector from './LineConnector'
import { NORMAL_VIEW } from '~/ui-constants'
import SmallTitle from '~/components/ui/SmallTitle'

function PlatformaticRuntimeButton ({ view }) {
  const globalState = useStackablesStore()
  const { services } = globalState
  const [currentBackgrounComponent, setCurrentBackgrounComponent] = useState(<RuntimeSmallCard classNameSvg={styles.svg} />)
  const [lines, setLines] = useState([])
  useEffect(() => {
    if (services.length > 0) {
      switch (services.length) {
        case 0:
        case 1:
          setCurrentBackgrounComponent(<RuntimeSmallCard classNameSvg={styles.svg} />)
          setLines([
            { id: 'service-0-connector', style: { position: 'absolute', left: 129, top: -5 }, height: 40, width: 115, cancelAnimation: true },
            { id: 'service-1-connector-dashed', style: { position: 'absolute', left: 300, top: -5 }, height: 40, width: 115, cancelAnimation: true, topLeftToBottomRight: false, dashedStroke: true }
          ])
          break
        case 2:
          setCurrentBackgrounComponent(<RuntimeMediumCard classNameSvg={styles.svg} />)
          setLines([
            { id: 'service-0-connector', style: { position: 'absolute', left: 129, top: -5 }, height: 40, width: 145, cancelAnimation: true },
            { id: 'service-1-connector', style: { position: 'absolute', left: 300, top: -5 }, height: 40, width: 115, cancelAnimation: true, topLeftToBottomRight: false },
            { id: 'service-2-connector-dashed', style: { position: 'absolute', left: 505, top: -5 }, height: 40, width: 200, cancelAnimation: true, topLeftToBottomRight: false, dashedStroke: true }
          ])
          break

        default:
          setCurrentBackgrounComponent(<RuntimeLargeCard classNameSvg={styles.svg} />)
          if (view === NORMAL_VIEW) {
            setLines([
              { id: 'service-0-connector', style: { position: 'absolute', left: 129, top: -5 }, height: 40, width: 205, cancelAnimation: true },
              { id: 'service-1-connector', style: { position: 'absolute', left: 409, top: -5 }, height: 40, width: 145, cancelAnimation: true },
              { id: 'service-3-connector', style: { position: 'absolute', left: 575, top: -5 }, height: 40, width: 115, cancelAnimation: true, topLeftToBottomRight: false },
              { id: 'service-3-connector-dashed', style: { position: 'absolute', left: 750, top: -5 }, height: 40, width: 220, cancelAnimation: true, topLeftToBottomRight: false, dashedStroke: true }
            ])
          } else {
            setLines([
              { id: 'service-0-connector-dashed', style: { position: 'absolute', left: 750, top: -5 }, height: 40, width: 220, cancelAnimation: true, topLeftToBottomRight: false, dashedStroke: true }
            ])
          }
          break
      }
    }
  }, [services.length, view])

  return (
    <div className={styles.container}>
      {currentBackgrounComponent}
      <div className={`${commonStyles.smallFlexBlock} ${commonStyles.itemsCenter}`}>
        <SmallTitle
          iconName='CircleExclamationIcon'
          title='Platformatic Runtime'
          titleClassName={`${typographyStyles.desktopBodyLarge} ${typographyStyles.textWhite}`}
          containerClassName={`${commonStyles.smallFlexRow} ${typographyStyles.textCenter}`}
        />
      </div>
      {lines.map((line, index) =>
        (<LineConnector key={index} id={`vl-${index}`} {...line} />)
      )}
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
