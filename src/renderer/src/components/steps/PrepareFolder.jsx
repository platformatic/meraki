'use strict'
import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import styles from './PrepareFolder.module.css'
import commonStyles from '~/styles/CommonStyles.module.css'
import typographyStyles from '~/styles/Typography.module.css'
import { WHITE, RICH_BLACK, TRANSPARENT, OPACITY_30, BOX_SHADOW } from '@platformatic/ui-components/src/components/constants'
import { BorderedBox, Button } from '@platformatic/ui-components'
import useStackablesStore from '~/useStackablesStore'
import CountDown from '~/components/ui/CountDown'
import '~/components/component.animation.css'
import { callPrepareFolder, logInfo, quitApp } from '~/api'
import { NONE, RUNNING, SUCCESS, ERROR } from '~/ui-constants'
import Title from '~/components/ui/Title'

const PrepareFolder = React.forwardRef(({ onNext, onBack }, ref) => {
  const globalState = useStackablesStore()
  const { formData, services, setTemplate } = globalState
  const [countDownStatus, setCountDownStatus] = useState(NONE)
  const [folderPrepared, setFolderPrepared] = useState(false)
  const [folderPreparedError, setFolderPreparedError] = useState(false)
  const [folderPreparedSuccess, setFolderPreparedSuccess] = useState(false)
  const [npmLogs, setNpmLogs] = useState([])
  const [logValue, setLogValue] = useState(null)

  useEffect(() => {
    async function prepareFolder () {
      try {
        const templateNames = services.map((service) => service.template.name)
        setCountDownStatus(RUNNING)
        const response = await callPrepareFolder(formData.createApplication.path, templateNames, formData.createApplication.application)
        let tmpTemplate
        let envVars
        services.forEach(service => {
          tmpTemplate = { ...service.template }
          envVars = response[tmpTemplate.name] || []
          setTemplate(service.name, { ...tmpTemplate, envVars })
        })
        setFolderPreparedSuccess(true)
        setCountDownStatus(SUCCESS)
      } catch (error) {
        console.error(`Error on prepareFolder ${error}`)
        setFolderPreparedError(true)
        setCountDownStatus(ERROR)
      } finally {
        setFolderPrepared(true)
      }
    }
    logInfo((_, value) => setLogValue(value))
    prepareFolder()
  }, [])

  useEffect(() => {
    if (logValue) {
      const str = [new Date().toISOString(), logValue.level.toUpperCase(), logValue.message]
      setNpmLogs([...npmLogs, { level: logValue.level, message: str.join(' - ') }])
    }
  }, [logValue])

  function onClickConfigureServices () {
    onNext()
  }

  function renderLog (log, index) {
    let className = `${typographyStyles.desktopOtherCliTerminalSmall} `
    className += log.level === 'info' ? `${typographyStyles.textWhite}` : `${typographyStyles.textErrorRed}`
    return <p key={index} className={className}>{log.message}</p>
  }

  function onClickCloseApp () {
    quitApp()
  }

  function onClickCopyLogs () {
    let str = ''
    npmLogs.forEach(log => (str += `${log.message}\r\n`))
    navigator.clipboard.writeText(str)
  }

  return (
    <div className={styles.container} ref={ref}>
      <div className={commonStyles.mediumFlexBlock}>
        <div className={`${commonStyles.mediumFlexBlock} ${commonStyles.fullWidth}`}>
          <Title
            title={formData.createApplication.application}
            iconName='AppIcon'
            dataAttrName='cy'
            dataAttrValue='step-title'
          />
          <p className={`${typographyStyles.desktopBodyLarge} ${typographyStyles.textWhite} ${typographyStyles.opacity70}`}>
            We are preparing your folder.<br /> Once all the steps are done you will be able to configure your services.
          </p>
        </div>
        <div className={`${commonStyles.smallFlexRow} ${commonStyles.fullWidth} ${commonStyles.justifyEnd}`}>
          <Button
            disabled={!folderPrepared}
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
        <div className={`${commonStyles.smallFlexRow}`}>
          <Button
            disabled={!folderPrepared}
            label='Back'
            onClick={() => onBack()}
            color={WHITE}
            backgroundColor={TRANSPARENT}
            paddingClass={`${commonStyles.buttonPadding} cy-action-back`}
          />
        </div>
        {folderPreparedError
          ? <Button
              label='Close'
              onClick={() => onClickCloseApp()}
              color={RICH_BLACK}
              bordered={false}
              backgroundColor={WHITE}
              hoverEffect={BOX_SHADOW}
              paddingClass={`${commonStyles.buttonPadding} cy-action-close`}
            />
          : <Button
              disabled={!folderPreparedSuccess}
              label='Next - Configure Services'
              onClick={() => onClickConfigureServices()}
              color={RICH_BLACK}
              bordered={false}
              backgroundColor={WHITE}
              hoverEffect={BOX_SHADOW}
              paddingClass={`${commonStyles.buttonPadding} cy-action-next`}
            />}
      </div>
    </div>
  )
})

PrepareFolder.propTypes = {
  /**
     * onNext
     */
  onNext: PropTypes.func,
  /**
     * onBack
     */
  onBack: PropTypes.func
}

PrepareFolder.defaultProps = {
  onNext: () => {},
  onBack: () => {}
}

export default PrepareFolder
