'use strict'
import { useEffect, useState } from 'react'
import styles from './Header.module.css'
import commonStyles from '~/styles/CommonStyles.module.css'
import typographyStyles from '~/styles/Typography.module.css'
import { Button, HorizontalSeparator } from '@platformatic/ui-components'
import { WHITE, MARGIN_8, MARGIN_0 } from '@platformatic/ui-components/src/components/constants'
import MerakiLogo from '~/components/ui/MerakiLogo'
import useWindowDimensions from '~/hooks/useWindowDimensions'
import { MAX_WIDTH_LG } from '~/ui-constants'

function Header () {
  const { width: innerWindow } = useWindowDimensions()
  const [margins, setMargins] = useState(MARGIN_8)

  useEffect(() => {
    if (innerWindow < MAX_WIDTH_LG && margins === MARGIN_8) {
      setMargins(MARGIN_0)
    }
    if (innerWindow >= MAX_WIDTH_LG && margins === MARGIN_0) {
      setMargins(MARGIN_8)
    }
  }, [innerWindow])

  return (
    <>
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
      <HorizontalSeparator marginBottom={margins} marginTop={margins} />
    </>
  )
}

export default Header
