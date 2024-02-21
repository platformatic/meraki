'use strict'
import styles from './Header.module.css'
import commonStyles from '~/styles/CommonStyles.module.css'
import typographyStyles from '~/styles/Typography.module.css'
import { Button, HorizontalSeparator } from '@platformatic/ui-components'
import { WHITE, MARGIN_0, OPACITY_30 } from '@platformatic/ui-components/src/components/constants'
import MerakiLogo from '~/components/ui/MerakiLogo'

function Header () {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={commonStyles.smallFlexRow}>
          <MerakiLogo />
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
      <HorizontalSeparator marginBottom={MARGIN_0} marginTop={MARGIN_0} color={WHITE} opacity={OPACITY_30} />
    </div>
  )
}

export default Header
