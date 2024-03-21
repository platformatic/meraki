'use strict'
import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { BorderedBox, Button } from '@platformatic/ui-components'
import commonStyles from '~/styles/CommonStyles.module.css'
import typographyStyles from '~/styles/Typography.module.css'
import styles from './UpdatingApplication.module.css'
import { WHITE, TRANSPARENT, RICH_BLACK, OPACITY_30, BOX_SHADOW } from '@platformatic/ui-components/src/components/constants'
import useStackablesStore from '~/useStackablesStore'
import Title from '~/components/ui/Title'
import CountDown from '~/components/ui/CountDown'
import { callUpdateApp, logInfo } from '~/api'
import { NONE, RUNNING, SUCCESS, ERROR } from '~/ui-constants'

const UpdatingApplication = React.forwardRef(({ onBack, onClickGoToApps, applicationSelectedId }, ref) => {
  const globalState = useStackablesStore()
  const { formData } = globalState
  const [appGenerated, setAppGenerated] = useState(false)
  const [appGeneratedError, setAppGeneratedError] = useState(false)
  const [npmLogs, setNpmLogs] = useState([])
  const [logValue, setLogValue] = useState(null)
  const [countDownStatus, setCountDownStatus] = useState(NONE)

  useEffect(() => {
    logInfo((_, value) => setLogValue(value))
    async function generateApplication () {
      try {
        setCountDownStatus(RUNNING)
        const obj = { projectName: formData.createApplication.application, services: formData.configuredServices.services, ...formData.configureApplication }
        await callUpdateApp(applicationSelectedId, formData.createApplication.path, obj)
        setCountDownStatus(SUCCESS)
      } catch (error) {
        console.error(`Error on generateApplication ${error}`)
        setAppGeneratedError(true)
        setCountDownStatus(ERROR)
        setLogValue({ level: 'error', message: `Error on generateApplication ${error}` })
      } finally {
        setAppGenerated(true)
      }
    }
    generateApplication()
  }, [])

  useEffect(() => {
    if (logValue) {
      const str = [new Date().toISOString(), logValue.level.toUpperCase(), logValue.message]
      setNpmLogs([...npmLogs, { level: logValue.level, message: str.join(' - ') }])
    }
  }, [logValue])

  function renderLog (log, index) {
    let className = `${typographyStyles.desktopOtherCliTerminalSmall} `
    className += log.level === 'info' ? `${typographyStyles.textWhite}` : `${typographyStyles.textErrorRed}`
    return <p key={index} className={className}>{log.message}</p>
  }

  function onClickCopyLogs () {
    let str = ''
    npmLogs.forEach(log => (str += `${log.message}\r\n`))
    navigator.clipboard.writeText(str)
  }

  return (
    <>
      <div className={`${styles.container} ${commonStyles.mediumFlexBlock} ${commonStyles.fullWidth}`} ref={ref}>
        <div className={commonStyles.mediumFlexBlock}>
          <Title
            title={`Generating ${formData.createApplication.application}`}
            iconName='AppIcon'
            dataAttrName='cy'
            dataAttrValue='step-title'
          />
          <p className={`${typographyStyles.desktopBodyLarge} ${typographyStyles.textWhite} ${typographyStyles.opacity70}`}>
            We are updating your app. <br />Once all the steps are done you will be able to complete and use your application.
          </p>
        </div>
        <div className={`${commonStyles.smallFlexRow} ${commonStyles.fullWidth} ${commonStyles.justifyEnd}`}>
          <Button
            disabled={!appGenerated}
            label='Copy Logs'
            onClick={() => onClickCopyLogs()}
            color={WHITE}
            backgroundColor={RICH_BLACK}
            paddingClass={`${commonStyles.buttonPadding} cy-action-donwload-logs`}
          />
        </div>
        <BorderedBox classes={`${commonStyles.fullWidth} ${styles.content}`} backgroundColor={TRANSPARENT} borderColorOpacity={OPACITY_30} color={WHITE}>
          <div className={`${commonStyles.flexBlockNoGap} `}>
            {npmLogs.map((log, index) => renderLog(log, index))}
          </div>
        </BorderedBox>
        <div className={`${commonStyles.mediumFlexBlock} ${commonStyles.halfWidth}`}>
          <CountDown status={countDownStatus} />
        </div>
      </div>
      <div className={`${styles.buttonContainer} ${commonStyles.fullWidth}`}>
        <Button
          type='button'
          label='Back'
          onClick={() => onBack()}
          color={WHITE}
          backgroundColor={TRANSPARENT}
          paddingClass={`${commonStyles.buttonPadding} cy-action-back`}
          disabled={!appGeneratedError}
        />
        <Button
          disabled={!appGenerated}
          label='Go to Apps'
          onClick={() => onClickGoToApps()}
          color={RICH_BLACK}
          bordered={false}
          backgroundColor={WHITE}
          hoverEffect={BOX_SHADOW}
          paddingClass={commonStyles.buttonPadding}
        />
      </div>
    </>
  )
})

UpdatingApplication.propTypes = {
  /**
   * onBack
   */
  onBack: PropTypes.func,
  /**
   * onClickGoToApps
   */
  onClickGoToApps: PropTypes.func,
  /**
   * applicationSelectedId
   */
  applicationSelectedId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]).isRequired

}

UpdatingApplication.defaultProps = {
  onBack: () => {},
  onClickGoToApps: () => {}
}

export default UpdatingApplication
