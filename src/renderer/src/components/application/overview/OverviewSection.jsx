'use strict'
import React from 'react'
import PropTypes from 'prop-types'
import { WHITE, OPACITY_30, MEDIUM, TRANSPARENT, SMALL } from '@platformatic/ui-components/src/components/constants'
import styles from './OverviewSection.module.css'
import typographyStyles from '~/styles/Typography.module.css'
import commonStyles from '~/styles/CommonStyles.module.css'
import { Button, PlatformaticIcon, VerticalSeparator } from '@platformatic/ui-components'
import Icons from '@platformatic/ui-components/src/components/icons'

function OverviewSection ({ applicationSelected }) {
  function onClickApiReference () {

  }
  return (
    <div className={`${commonStyles.mediumFlexBlock} ${commonStyles.fullWidth}`}>
      <div className={`${commonStyles.mediumFlexRow} ${commonStyles.fullWidth}`}>
        <Icons.AppDetailsIcon
          color={WHITE}
          size={MEDIUM}
        />
        <h3 className={`${typographyStyles.desktopHeadline3} ${typographyStyles.textWhite}`}>Overview</h3>
      </div>
      <div className={`${commonStyles.mediumFlexRow} ${commonStyles.fullWidth} ${commonStyles.itemsCenter} `}>
        <div className={`${commonStyles.smallFlexRow} ${commonStyles.itemsCenter}`}>
          <span className={`${typographyStyles.desktopBody} ${typographyStyles.textWhite} ${typographyStyles.opacity70}`}>Current Platformatic Version</span>
          <span className={`${typographyStyles.desktopBodyLarge} ${typographyStyles.textYellowWarning}`}>{applicationSelected.platformaticVersion}</span>
        </div>
      </div>

      <div className={`${commonStyles.mediumFlexRow} ${commonStyles.fullWidth} ${commonStyles.itemsCenter} ${commonStyles.justifyBetween} `}>
        <div className={`${commonStyles.mediumFlexRow} ${commonStyles.fullWidth} ${commonStyles.itemsCenter} `}>
          <div className={`${commonStyles.smallFlexRow} ${commonStyles.itemsCenter}`}>
            <span className={`${typographyStyles.desktopBody} ${typographyStyles.textWhite} ${typographyStyles.opacity70}`}>Entrypoint:</span>
            <span className={`${typographyStyles.desktopBodyLarge} ${typographyStyles.textWarningYellow}`}>{applicationSelected.platformaticVersion}</span>
          </div>

          <VerticalSeparator color={WHITE} backgroundColorOpacity={OPACITY_30} />

          <div className={`${commonStyles.smallFlexRow} ${commonStyles.itemsCenter}`}>
            <span className={`${typographyStyles.desktopBodyLarge} ${typographyStyles.textWhite} ${typographyStyles.opacity70}`}>URL:</span>
            <span className={`${typographyStyles.desktopBodyLarge} ${typographyStyles.textWhite}`}>{applicationSelected.entryPoint} </span>
            <PlatformaticIcon iconName='ExpandIcon' color={WHITE} size={SMALL} onClick={() => window.open(applicationSelected.entryPoint, '_blank')} internalOverHandling />
          </div>
        </div>

        <div className={`${styles.buttonContainer}`}>
          <Button
            type='button'
            label='API reference'
            onClick={() => onClickApiReference()}
            color={WHITE}
            backgroundColor={TRANSPARENT}
            paddingClass={commonStyles.buttonPadding}
            platformaticIcon={{ iconName: 'APIDocsIcon', color: WHITE }}
            textClass={typographyStyles.desktopBody}
          />
        </div>
      </div>
    </div>
  )
}

OverviewSection.propTypes = {
  /**
   * applicationSelected
    */
  applicationSelected: PropTypes.object
}

OverviewSection.defaultProps = {
  applicationSelected: {}
}

export default OverviewSection
