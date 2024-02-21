'use strict'
import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { BorderedBox, Button, HorizontalSeparator, Modal } from '@platformatic/ui-components'
import commonStyles from '~/styles/CommonStyles.module.css'
import typographyStyles from '~/styles/Typography.module.css'
import styles from './GeneratingApplication.module.css'
import { WHITE, TRANSPARENT, RICH_BLACK, OPACITY_30, MODAL_POPUP_V2, MARGIN_0, BOX_SHADOW } from '@platformatic/ui-components/src/components/constants'
import useStackablesStore from '~/useStackablesStore'
import Title from '~/components/ui/Title'
import CountDown from '~/components/ui/CountDown'
import { callCreateApp, logInfo, quitApp } from '~/api'
import { NONE, RUNNING, SUCCESS, ERROR } from '~/ui-constants'
const GeneratingApplication = React.forwardRef(({ onBack, onRestartProcess }, ref) => {
  const globalState = useStackablesStore()
  const { formData, reset } = globalState
  const [appGenerated, setAppGenerated] = useState(false)
  const [appGeneratedError, setAppGeneratedError] = useState(false)
  // const [appGeneratedSuccess, setAppGeneratedSuccess] = useState(false)
  const [npmLogs, setNpmLogs] = useState([])
  const [logValue, setLogValue] = useState(null)
  const [countDownStatus, setCountDownStatus] = useState(NONE)
  const [restartInProgress, setRestartInProgress] = useState(false)
  const [showModalContinue, setShowModalContinue] = useState(false)

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

  function onClickComplete () {
    setShowModalContinue(false)
    quitApp()
  }

  function onClickRestart () {
    setShowModalContinue(false)
    setRestartInProgress(true)
    reset()
    onRestartProcess()
  }

  return !restartInProgress && (
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
            We are generating your app. <br />Once all the steps are done you will be able to complete and use your new application.
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
          label='Continue'
          onClick={() => setShowModalContinue(true)}
          color={RICH_BLACK}
          bordered={false}
          backgroundColor={WHITE}
          hoverEffect={BOX_SHADOW}
          paddingClass={commonStyles.buttonPadding}
        />

      </div>
      {showModalContinue && (
        <Modal
          key='editService'
          setIsOpen={() => setShowModalContinue(false)}
          title='Application Created!'
          titleClassName={`${typographyStyles.desktopHeadline4} ${typographyStyles.textWhite}`}
          layout={MODAL_POPUP_V2}
        >
          <div className={`${commonStyles.mediumFlexBlock} ${commonStyles.fullWidth}`}>
            <p className={`${typographyStyles.desktopBody} ${typographyStyles.textWhite} ${commonStyles.fullWidth}`}>
              <span className={`${typographyStyles.opacity70}`}>Your application has been created successfull. <br />Click on "Restart" to create another application from scratch <br /> or click on "Complete" to close the application.</span>
            </p>
            <HorizontalSeparator marginBottom={MARGIN_0} marginTop={MARGIN_0} color={WHITE} opacity={OPACITY_30} />
            <div className={`${commonStyles.mediumFlexRow} ${commonStyles.justifyBetween}`}>
              <Button
                type='button'
                paddingClass={commonStyles.buttonPadding}
                label='Cancel'
                onClick={() => setShowModalContinue(false)}
                color={WHITE}
                backgroundColor={TRANSPARENT}
              />
              <div className={`${commonStyles.smallFlexRow} `}>
                <Button
                  disabled={!appGenerated}
                  label='Restart'
                  onClick={() => onClickRestart()}
                  color={WHITE}
                  backgroundColor={TRANSPARENT}
                  paddingClass={`${commonStyles.buttonPadding} cy-action-restart`}
                />
                <Button
                  disabled={!appGenerated}
                  label={appGeneratedError ? 'Close' : 'Complete'}
                  onClick={() => onClickComplete()}
                  color={RICH_BLACK}
                  bordered={false}
                  backgroundColor={WHITE}
                  hoverEffect={BOX_SHADOW}
                  paddingClass={`${commonStyles.buttonPadding} cy-action-next`}
                />
              </div>
            </div>
          </div>
        </Modal>
      )}
    </>
  )
})

GeneratingApplication.propTypes = {
  /**
   * onBack
   */
  onBack: PropTypes.func,
  /**
   * onRestartProcess
   */
  onRestartProcess: PropTypes.func
}

GeneratingApplication.defaultProps = {
  onBack: () => {},
  onRestartProcess: () => {}
}

export default GeneratingApplication
