'use strict'
import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import styles from './PrepareFolder.module.css'
import commonStyles from '~/styles/CommonStyles.module.css'
import typographyStyles from '~/styles/Typography.module.css'
import { WHITE, RICH_BLACK, TRANSPARENT, OPACITY_30 } from '@platformatic/ui-components/src/components/constants'
import { BorderedBox, Button } from '@platformatic/ui-components'
import useStackablesStore from '~/useStackablesStore'
import EditableTitle from '~/components/ui/EditableTitle'
import '~/components/component.animation.css'
import { callPrepareFolder, logInfo } from '~/api'

const PrepareFolder = React.forwardRef(({ onNext }, ref) => {
  const globalState = useStackablesStore()
  const { formData, addFormData, services, setTemplate } = globalState
  const [folderPrepared, setFolderPrepared] = useState(false)
  const [folderPreparedError, setFolderPreparedError] = useState(false)
  const [folderPreparedSuccess, setFolderPreparedSuccess] = useState(false)
  const [npmLogs, setNpmLogs] = useState([])
  const [logValue, setLogValue] = useState(null)

  useEffect(() => {
    const templateNames = services.map((service) => service.template.name)
    logInfo((_, value) => setLogValue(value))
    async function prepareFolder () {
      try {
        const response = await callPrepareFolder(formData.createApplication.path, templateNames)
        let tmpTemplate
        let envVars
        services.forEach(service => {
          tmpTemplate = { ...service.template }
          envVars = response[tmpTemplate.name] || []
          setTemplate(service.name, { ...tmpTemplate, envVars })
        })
        setFolderPreparedSuccess(true)
      } catch (error) {
        console.error(`Error on prepareFolder ${error}`)
        setFolderPreparedError(true)
      } finally {
        setFolderPrepared(true)
      }
    }
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

  function handleEditApplicationName (newName) {
    addFormData({
      createApplication: {
        application: newName,
        service: formData.createApplication.service,
        path: formData.createApplication.path
      }
    })
  }

  function renderLog (log, index) {
    let className = `${typographyStyles.desktopOtherCliTerminalSmall} `
    className += log.level === 'info' ? `${typographyStyles.textWhite}` : `${typographyStyles.textErrorRed}`
    return <p key={index} className={className}>{log.message}</p>
  }

  function onClickCloseApp () {
    // TODO: implement it
    console.log('onClickCloseApp')
  }

  function onClickCopyLogs () {
    let str = ''
    npmLogs.forEach(log => (str += `${log.message}\r\n`))
    navigator.clipboard.writeText(str)
  }

  return (
    <div className={styles.container} ref={ref}>
      <div className={commonStyles.largeFlexBlock}>
        <div className={`${commonStyles.mediumFlexBlock} ${commonStyles.halfWidth}`}>
          <EditableTitle
            title={formData.createApplication.application}
            iconName='AppIcon'
            onClickSubmit={(name) => handleEditApplicationName(name)}
            dataAttrName='cy'
            dataAttrValue='step-title'
          />
          <p className={`${typographyStyles.desktopBodyLarge} ${typographyStyles.textWhite} ${typographyStyles.opacity70}`}>Select a template and plugins for your service from our Stackables Marketplace. Once you have chosen a template you can add another Service.</p>
        </div>
        <BorderedBox classes={`${commonStyles.fullWidth} ${styles.content}`} backgroundColor={TRANSPARENT} borderColorOpacity={OPACITY_30} color={WHITE}>
          <div className={`${commonStyles.flexBlockNoGap} `}>
            {npmLogs.map((log, index) => renderLog(log, index))}
          </div>
        </BorderedBox>
      </div>
      <div className={`${styles.buttonContainer} ${commonStyles.fullWidth}`}>
        <Button
          disabled={!folderPrepared}
          label='Copy Logs'
          onClick={() => onClickCopyLogs()}
          color={WHITE}
          backgroundColor={RICH_BLACK}
          classes={`${commonStyles.buttonPadding} cy-action-donwload-logs`}
        />
        {folderPreparedError
          ? <Button
              label='Close'
              onClick={() => onClickCloseApp()}
              color={RICH_BLACK}
              bordered={false}
              backgroundColor={WHITE}
              classes={`${commonStyles.buttonPadding} cy-action-close`}
            />
          : <Button
              disabled={!folderPreparedSuccess}
              label='Next - Configure Services'
              onClick={() => onClickConfigureServices()}
              color={RICH_BLACK}
              bordered={false}
              backgroundColor={WHITE}
              classes={`${commonStyles.buttonPadding} cy-action-next`}
            />}
      </div>
    </div>
  )
})

PrepareFolder.propTypes = {
  /**
     * onNext
     */
  onNext: PropTypes.func
}

PrepareFolder.defaultProps = {
  onNext: () => {}
}

export default PrepareFolder
