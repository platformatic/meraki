'use strict'
import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { RICH_BLACK, WHITE, MEDIUM, OPACITY_30, MARGIN_0, TRANSPARENT } from '@platformatic/ui-components/src/components/constants'
import styles from './ServiceElement.module.css'
import typographyStyles from '~/styles/Typography.module.css'
import commonStyles from '~/styles/CommonStyles.module.css'
import { BorderedBox, ButtonOnlyIcon, HorizontalSeparator, PlatformaticIcon, VerticalSeparator } from '@platformatic/ui-components'

function ServiceElement ({ service }) {
  const [expanded, setExpanded] = useState(false)
  function onClickScalarIntegration () {

  }

  return (
    <BorderedBox classes={styles.paddingElement} backgroundColor={RICH_BLACK} color={WHITE} borderColorOpacity={OPACITY_30}>
      <div className={`${commonStyles.smallFexBlock} ${commonStyles.fullWidth}`}>
        <div className={`${commonStyles.mediumFlexRow} ${commonStyles.fullWidth} ${commonStyles.itemsCenter} ${commonStyles.justifyBetween} `}>
          <div className={`${commonStyles.smallFlexRow} ${commonStyles.itemsCenter}`}>
            <span className={`${typographyStyles.desktopBodyLargeSemibold} ${typographyStyles.textWhite}`}>{service.name}</span>
          </div>

          <div className={`${styles.buttonContainer}`}>
            <ButtonOnlyIcon
              type='button'
              onClick={() => onClickScalarIntegration()}
              color={WHITE}
              backgroundColor={TRANSPARENT}
              paddingClass={commonStyles.buttonSquarePadding}
              platformaticIcon={{ iconName: 'RestartIcon', color: WHITE }}
              textClass={typographyStyles.desktopBody}
            />
            <VerticalSeparator color={WHITE} backgroundColorOpacity={OPACITY_30} />
            <PlatformaticIcon iconName={expanded ? 'ArrowUpIcon' : 'ArrowDownIcon'} color={WHITE} size={MEDIUM} onClick={() => setExpanded(!expanded)} internalOverHandling />
          </div>
        </div>
        {expanded && (
          <>
            <HorizontalSeparator marginBottom={MARGIN_0} marginTop={MARGIN_0} color={WHITE} opacity={OPACITY_30} />
            <div className={`${commonStyles.smallFlexRow} ${commonStyles.itemsCenter}`}>
              <span className={`${typographyStyles.desktopBodyLarge} ${typographyStyles.textWhite} ${typographyStyles.opacity70}`}>Templates</span>
            </div>
            <div className={`${commonStyles.smallFlexRow} ${commonStyles.itemsCenter}`}>
              <span className={`${typographyStyles.desktopBodyLarge} ${typographyStyles.textWhite} ${typographyStyles.opacity70}`}>Plugins</span>
            </div>
          </>
        )}
      </div>
    </BorderedBox>
  )
}

ServiceElement.propTypes = {
  /**
   * id
    */
  id: PropTypes.string,
  /**
   * services
    */
  services: PropTypes.array

}

ServiceElement.defaultProps = {
  id: {},
  services: []
}

export default ServiceElement
