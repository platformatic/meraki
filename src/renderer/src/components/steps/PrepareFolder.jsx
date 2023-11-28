'use strict'
import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import styles from './PrepareFolder.module.css'
import commonStyles from '~/styles/CommonStyles.module.css'
import typographyStyles from '~/styles/Typography.module.css'
import { WHITE, RICH_BLACK } from '@platformatic/ui-components/src/components/constants'
import { Button } from '@platformatic/ui-components'
import useStackablesStore from '~/useStackablesStore'
import EditableTitle from '~/components/ui/EditableTitle'
import '~/components/component.animation.css'
import { callPrepareFolder, logInfo } from '~/api'

const PrepareFolder = React.forwardRef(({ onNext }, ref) => {
  const globalState = useStackablesStore()
  const { formData, addFormData, services } = globalState
  const [folderPrepared, setFolderPrepared] = useState(false)
  const [npmLogs, setNpmLogs] = useState([])
  const [logValue, setLogValue] = useState(null)

  useEffect(() => {
    const templateNames = services.map((service) => service.template.name)
    logInfo((_, value) => setLogValue(value))
    async function prepareFolder () {
      await callPrepareFolder(formData.createApplication.path, templateNames)
      // setFolderPrepared(true)
    }
    prepareFolder()
  }, [])

  useEffect(() => {
    if (logValue) {
      setNpmLogs([...npmLogs, { ...logValue }])
    }
  }, [logValue])

  useEffect(() => {
    // call your increment function here
  }, [])

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
    let className = `${typographyStyles.desktopBodySmall} `
    let str = [log.level.toUpperCase()]
    className += log.level === 'info' ? `${typographyStyles.textWhite}` : `${typographyStyles.textErrorRed}`
    str = str.concat(Object.keys(log.message).map(k => log.message[k]))
    return <p key={index} className={className}>{str.join(' ')}</p>
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
        <div className={`${commonStyles.mediumFlexBlock} ${commonStyles.fullWidth} ${styles.content}`}>
          {npmLogs.map((log, index) => renderLog(log, index))}
        </div>
      </div>
      <div className={`${styles.buttonContainer} ${commonStyles.fullWidth}`}>
        <Button
          disabled={folderPrepared}
          label='Next - Configure Services'
          onClick={() => onClickConfigureServices()}
          color={RICH_BLACK}
          bordered={false}
          backgroundColor={WHITE}
          classes={`${commonStyles.buttonPadding} cy-action-next`}
        />
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
