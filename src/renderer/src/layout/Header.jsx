'use strict'
import styles from './Header.module.css'
import commonStyles from '~/styles/CommonStyles.module.css'
import typographyStyles from '~/styles/Typography.module.css'
import { Button, HorizontalSeparator, Logo } from '@platformatic/ui-components'
import { WHITE, MARGIN_8 } from '@platformatic/ui-components/src/components/constants'

function Header () {
  return (
    <>
      <div className={styles.header}>
        <div className={commonStyles.smallFlexRow}>
          <Logo width={70.74} height={56} />
          <span className={`${typographyStyles.textWhite} ${typographyStyles.desktopBodyLargeSemibold}`}>Platformatic</span>
        </div>
        <div className={commonStyles.smallFlexRow}>
          <span className={`${typographyStyles.desktopBodySmall} ${typographyStyles.textWhite} `}>Need Help?</span>
          <Button
            label='Chat on Discord'
            platformaticIcon={{ iconName: 'SocialDiscordIcon', color: WHITE }}
            color={WHITE}
            onClick={() => window.open(
              'https://discord.gg/platformatic',
              '_blank'
            )}
          />
        </div>
      </div>
      <HorizontalSeparator marginBottom={MARGIN_8} marginTop={MARGIN_8} />
    </>
  )
}

export default Header
