'use strict'
import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { RICH_BLACK, WHITE, OPACITY_30, TRANSPARENT, DULLS_BACKGROUND_COLOR, ANTI_FLASH_WHITE, MEDIUM } from '@platformatic/ui-components/src/components/constants'
import styles from './TopContent.module.css'
import typographyStyles from '~/styles/Typography.module.css'
import commonStyles from '~/styles/CommonStyles.module.css'
import { Button, VerticalSeparator } from '@platformatic/ui-components'
import { getFormattedDate } from '~/utilityDetails'
import { STATUS_RUNNING } from '~/ui-constants'
import Icons from '@platformatic/ui-components/src/components/icons'
import ApplicationStatusPills from '~/components/ui/ApplicationStatusPills'
import MerakiIcon from '~/components/ui/MerakiIcon'
import Forms from '@platformatic/ui-components/src/components/forms'

function TopContent ({ applicationSelected }) {
  const [form, setForm] = useState({ automaticRestart: false })

  function onStop () {

  }

  function onStart () {

  }

  function onRestart () {

  }

  function handleChange (event) {
    const isCheckbox = event.target.type === 'checkbox'
    const value = isCheckbox ? event.target.checked : event.target.value
    setForm(form => ({ ...form, [event.target.name]: value }))
  }

  return (
    <div className={`${commonStyles.mediumFlexBlock} ${commonStyles.fullWidth}`}>
      <div className={`${commonStyles.mediumFlexRow} ${commonStyles.fullWidth}`}>
        {applicationSelected.insideMeraki &&
          <MerakiIcon
            iconName='MerakiLogoIcon'
            color={WHITE}
            size={MEDIUM}
            tip='Application inside Meraki'
            onClick={() => {}}
          />}
        {!applicationSelected.insideMeraki &&
          <Icons.CLIIcon
            color={WHITE}
            size={MEDIUM}
          />}
        <h2 className={`${typographyStyles.desktopHeadline2} ${typographyStyles.textWhite}`}>{applicationSelected.name}</h2>
        <ApplicationStatusPills status={applicationSelected.status} />
      </div>
      <div className={`${commonStyles.mediumFlexRow} ${commonStyles.fullWidth} ${commonStyles.itemsCenter} ${commonStyles.justifyBetween} `}>
        <div className={`${commonStyles.mediumFlexRow} ${commonStyles.fullWidth} ${commonStyles.itemsCenter} `}>
          <div className={`${commonStyles.smallFlexRow} ${commonStyles.itemsCenter}`}>
            <span className={`${typographyStyles.desktopBodyLarge} ${typographyStyles.textWhite} ${typographyStyles.opacity70}`}>Last Update</span>
            <span className={`${typographyStyles.desktopBodyLarge} ${typographyStyles.textWhite}`}>{getFormattedDate(applicationSelected.lastUpdate)}</span>
          </div>

          <VerticalSeparator color={WHITE} backgroundColorOpacity={OPACITY_30} />

          <div className={`${commonStyles.smallFlexRow} ${commonStyles.itemsCenter}`}>
            <span className={`${typographyStyles.desktopBodyLarge} ${typographyStyles.textWhite} ${typographyStyles.opacity70}`}>Last Started</span>
            <span className={`${typographyStyles.desktopBodyLarge} ${typographyStyles.textWhite}`}>{getFormattedDate(applicationSelected.lastStarted)}</span>
          </div>

          <VerticalSeparator color={WHITE} backgroundColorOpacity={OPACITY_30} />
        </div>

        <div className={`${styles.buttonContainer} ${commonStyles.fullWidth}`}>
          <Button
            type='button'
            label={applicationSelected.status === STATUS_RUNNING ? 'Stop' : 'Start'}
            onClick={() => applicationSelected.status === STATUS_RUNNING ? onStop() : onStart()}
            color={RICH_BLACK}
            bordered={false}
            backgroundColor={WHITE}
            hoverEffect={DULLS_BACKGROUND_COLOR}
            hoverEffectProperties={{ changeBackgroundColor: ANTI_FLASH_WHITE }}
            paddingClass={commonStyles.buttonPadding}
            platformaticIcon={{ iconName: applicationSelected.status === STATUS_RUNNING ? 'CircleStopIcon' : 'CirclePlayIcon', color: RICH_BLACK }}
            textClass={typographyStyles.desktopBody}
          />
          <Button
            type='button'
            label='Restart'
            onClick={() => onRestart()}
            color={WHITE}
            backgroundColor={TRANSPARENT}
            paddingClass={commonStyles.buttonPadding}
            platformaticIcon={{ iconName: 'RestartIcon', color: WHITE }}
            textClass={typographyStyles.desktopBody}
          />
        </div>
      </div>

      <div className={`${commonStyles.mediumFlexRow} ${commonStyles.fullWidth}`}>

        <Forms.Field
          title='Automatic Restart'
          titleClassName={`${typographyStyles.desktopBodySemibold} ${typographyStyles.textWhite} `}
        >
          <Forms.ToggleSwitch
            label='This will allow you to automatically restart the application after any code or setting changes.'
            labelClassName={`${typographyStyles.desktopBodySmall} ${typographyStyles.textWhite} ${typographyStyles.opacity70}`}
            name='automaticRestart'
            onChange={handleChange}
            checked={form.automaticRestart}
          />
        </Forms.Field>
      </div>
    </div>
  )
}

TopContent.propTypes = {
  /**
   * applicationSelected
    */
  applicationSelected: PropTypes.object
}

TopContent.defaultProps = {
  applicationSelected: {}
}

export default TopContent
