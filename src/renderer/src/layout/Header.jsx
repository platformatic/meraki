'use strict'
import PropTypes from 'prop-types'
import styles from './Header.module.css'
import commonStyles from '~/styles/CommonStyles.module.css'
import typographyStyles from '~/styles/Typography.module.css'
import { Button, HorizontalSeparator } from '@platformatic/ui-components'
import { WHITE, MARGIN_0, OPACITY_30, RICH_BLACK, DULLS_BACKGROUND_COLOR, ANTI_FLASH_WHITE, SMALL } from '@platformatic/ui-components/src/components/constants'
import MerakiLogo from '~/components/ui/MerakiLogo'
import Navigation from '~/layout/Navigation'

function Header ({ showCreateNewApp, onClickCreateNewApp, onClickImportApp }) {
  const featureFlag = import.meta.env.VITE_DEV_FF

  const classNameContainer = featureFlag ? styles.containerFeatureFlag : styles.container
  const classNameHeader = featureFlag ? styles.headerFeatureFlag : styles.header
  return (
    <div className={classNameContainer}>
      <div className={classNameHeader}>
        <div className={`${commonStyles.largeFlexRow} ${commonStyles.itemsCenter}`}>
          <MerakiLogo />
          <Navigation />
        </div>
        {showCreateNewApp && (
          <div className={styles.buttonContainer}>
            <Button
              label='Create new App'
              onClick={() => onClickCreateNewApp()}
              color={RICH_BLACK}
              bordered={false}
              backgroundColor={WHITE}
              hoverEffect={DULLS_BACKGROUND_COLOR}
              hoverEffectProperties={{ changeBackgroundColor: ANTI_FLASH_WHITE }}
              paddingClass={`${commonStyles.buttonPadding} cy-action-create-app`}
              platformaticIcon={{ iconName: 'CreateAppIcon', size: SMALL, color: RICH_BLACK }}
              textClass={`${typographyStyles.desktopBody} ${typographyStyles.textWhite}`}
            />
            <Button
              label='Import App'
              onClick={() => onClickImportApp()}
              backgroundColor={RICH_BLACK}
              color={WHITE}
              paddingClass={`${commonStyles.buttonPadding} cy-action-import-app`}
              platformaticIcon={{ iconName: 'ImportAppIcon', size: SMALL, color: WHITE }}
              textClass={`${typographyStyles.desktopBody} ${typographyStyles.textWhite}`}
            />
          </div>
        )}
      </div>
      <HorizontalSeparator marginBottom={MARGIN_0} marginTop={MARGIN_0} color={WHITE} opacity={OPACITY_30} />
    </div>
  )
}

Header.propTypes = {
  /**
   * showCreateNewApp
    */
  showCreateNewApp: PropTypes.bool,
  /**
   * onClickCreateNewApp
    */
  onClickCreateNewApp: PropTypes.func,
  /**
   * onClickImportApp
    */
  onClickImportApp: PropTypes.func
}

Header.defaultProps = {
  showCreateNewApp: false,
  onClickCreateNewApp: () => {},
  onClickImportApp: () => {}
}

export default Header
