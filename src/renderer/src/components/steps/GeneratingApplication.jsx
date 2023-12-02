'use strict'
import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { BorderedBox, Button } from '@platformatic/ui-components'
import commonStyles from '~/styles/CommonStyles.module.css'
import typographyStyles from '~/styles/Typography.module.css'
import styles from './GeneratingApplication.module.css'
import { WHITE, TRANSPARENT, RICH_BLACK, OPACITY_30 } from '@platformatic/ui-components/src/components/constants'
import useStackablesStore from '~/useStackablesStore'
import Title from '~/components/ui/Title'
import CountDown from '~/components/ui/CountDown'
import { callCreateApp, logInfo, quitApp } from '~/api'
import { NONE, RUNNING, SUCCESS, ERROR } from '~/ui-constants'

const GeneratingApplication = React.forwardRef(({ onClickComplete, onRestartProcess }, ref) => {
  const globalState = useStackablesStore()
  const { formData } = globalState
  const [appGenerated, setAppGenerated] = useState(false)
  const [appGeneratedError, setAppGeneratedError] = useState(false)
  // const [appGeneratedSuccess, setAppGeneratedSuccess] = useState(false)
  const [npmLogs, setNpmLogs] = useState([])
  const [logValue, setLogValue] = useState(null)
  const [countDownStatus, setCountDownStatus] = useState(NONE)

  useEffect(() => {
    logInfo((_, value) => setLogValue(value))
    async function generateApplication () {
      try {
        setCountDownStatus(RUNNING)
        const obj = { projectName: formData.createApplication.application, services: formData.configuredServices.services, ...formData.configureApplication }
        await callCreateApp(formData.createApplication.path, obj)
        // setAppGeneratedSuccess(true)
        setCountDownStatus(SUCCESS)
      } catch (error) {
        console.error(`Error on generateApplication ${error}`)
        setAppGeneratedError(true)
        setCountDownStatus(ERROR)
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

  function onClickRestart () {
    onRestartProcess()
  }

  return (
    <div className={`${commonStyles.largeFlexBlock} ${commonStyles.fullWidth}`} ref={ref}>
      <div className={commonStyles.mediumFlexBlock}>
        <Title
          title={`Generating ${formData.createApplication.application}`}
          iconName='AppIcon'
          dataAttrName='cy'
          dataAttrValue='step-title'
        />
        <p className={`${typographyStyles.desktopBodyLarge} ${typographyStyles.textWhite} ${typographyStyles.opacity70}`}>
          We are generating your app. Once all the steps are done you will be able to complete and use your new application.
        </p>
      </div>
      <BorderedBox classes={`${commonStyles.fullWidth} ${styles.content}`} backgroundColor={TRANSPARENT} borderColorOpacity={OPACITY_30} color={WHITE}>
        <div className={`${commonStyles.flexBlockNoGap} `}>
          {npmLogs.map((log, index) => renderLog(log, index))}
        </div>
      </BorderedBox>
      <div className={`${commonStyles.mediumFlexBlock} ${commonStyles.halfWidth}`}>
        <CountDown status={countDownStatus} />
      </div>
      <div className={`${styles.buttonContainer} ${commonStyles.fullWidth}`}>
        <Button
          disabled={!appGenerated}
          label='Copy Logs'
          onClick={() => onClickCopyLogs()}
          color={WHITE}
          backgroundColor={RICH_BLACK}
          classes={`${commonStyles.buttonPadding} cy-action-donwload-logs`}
        />

        <div className={`${commonStyles.smallFlexRow} `}>
          <Button
            disabled={!appGenerated}
            label='Restart'
            onClick={() => onClickRestart()}
            color={WHITE}
            backgroundColor={TRANSPARENT}
            classes={`${commonStyles.buttonPadding} cy-action-next`}
          />
          <Button
            disabled={!appGenerated}
            label={appGeneratedError ? 'Close' : 'Complete'}
            onClick={() => onClickComplete()}
            color={RICH_BLACK}
            bordered={false}
            backgroundColor={WHITE}
            classes={`${commonStyles.buttonPadding} cy-action-next`}
          />
        </div>
      </div>
    </div>
  )
})

GeneratingApplication.propTypes = {
  /**
   * onClickComplete
   */
  onClickComplete: PropTypes.func,
  /**
   * onRestartProcess
   */
  onRestartProcess: PropTypes.func
}

GeneratingApplication.defaultProps = {
  onClickComplete: () => {
    quitApp()
  },
  onRestartProcess: () => {}

}

export default GeneratingApplication
